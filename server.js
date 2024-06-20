const express = require('express');
const path = require('path');
const http = require('http');
const fetch = require('node-fetch');
require('dotenv').config(); // 加載 .env 文件中的環境變數

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 緩存訪問憑證和過期時間的變數
let cachedToken = null;
let tokenExpiry = null;

// 獲取訪問憑證的函數
async function getAccessToken() {
    // 如果緩存的憑證存在且未過期，直接返回
    if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
        return cachedToken;
    }

    // API請求參數
    const appid = process.env.APP_ID;
    const secret = process.env.SECRET;
    const grant_type = 'client_credential';
    const url = `https://global-openapi.orionstar.com/v1/auth/get_token?appid=${appid}&secret=${secret}&grant_type=${grant_type}`;

    // 發送API請求獲取新的訪問憑證
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    // 如果請求失敗，拋出錯誤
    if (!response.ok) {
        throw new Error('Failed to fetch access token');
    }

    // 緩存新的訪問憑證和過期時間
    cachedToken = data.data.access_token;
    tokenExpiry = new Date(new Date().getTime() + data.data.expires_in * 1000); // 設置過期時間

    return cachedToken;
}

// 處理根路徑請求，返回index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 獲取訪問憑證的API端點
app.post('/api/get-token', async (req, res) => {
    try {
        const token = await getAccessToken();
        res.json({ access_token: token });
    } catch (error) {
        console.error('Error fetching access token:', error);
        res.status(500).send({ status: 'error', message: 'Failed to fetch access token' });
    }
});

// 獲取地圖位置列表的API端點
app.get('/api/map-position-list', async (req, res) => {
    try {
        // 獲取訪問憑證
        const accessToken = await getAccessToken();

        // 配置API請求選項
        const options = {
            hostname: 'global-openapi.orionstar.com',
            port: 80,
            path: '/v1/robot/map/position_list',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };

        // 發送API請求獲取地圖位置列表
        const mapRequest = http.request(options, (mapResponse) => {
            let data = '';

            // 接收數據塊
            mapResponse.on('data', (chunk) => {
                data += chunk;
            });

            // 數據接收完成後返回結果
            mapResponse.on('end', () => {
                res.send({ status: 'success', positionList: JSON.parse(data) });
            });
        });

        // 處理API請求錯誤
        mapRequest.on('error', (error) => {
            console.error('Error fetching map position list:', error);
            res.status(500).send({ status: 'error', message: 'Failed to fetch map position list' });
        });

        mapRequest.end();
    } catch (error) {
        console.error('Error fetching access token or fetching map position list:', error);
        res.status(500).send({ status: 'error', message: 'Failed to fetch map position list' });
    }
});

// 發送機器人指令的API端點
app.post('/api/robot-command', async (req, res) => {
    const { command, parameters } = req.body;
    console.log(`Received command: ${command}`);

    let apiEndpoint;
    // 根據指令設置API端點
    switch (command) {
        case '導航':
            apiEndpoint = '/v1/robot/pipe/cmd_navigation';
            break;
        case '取消導航':
            apiEndpoint = '/v1/robot/pipe/cmd_navigation_stop';
            break;
        // 其他指令
        default:
            return res.status(400).send({ status: 'error', message: 'Unknown command' });
    }

    try {
        // 獲取訪問憑證
        const accessToken = await getAccessToken();

        // 配置API請求選項
        const options = {
            hostname: 'global-openapi.orionstar.com',
            port: 80,
            path: apiEndpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };

        // 發送API請求給機器人
        const robotRequest = http.request(options, (robotResponse) => {
            let data = '';

            // 接收數據塊
            robotResponse.on('data', (chunk) => {
                data += chunk;
            });

            // 數據接收完成後返回結果
            robotResponse.on('end', () => {
                res.send({ status: 'success', robotResponse: JSON.parse(data) });
            });
        });

        // 處理API請求錯誤
        robotRequest.on('error', (error) => {
            console.error('Error communicating with robot:', error);
            res.status(500).send({ status: 'error', message: 'Failed to communicate with robot' });
        });

        // 發送指令參數
        robotRequest.write(JSON.stringify({ parameters }));
        robotRequest.end();
    } catch (error) {
        console.error('Error fetching access token or communicating with robot:', error);
        res.status(500).send({ status: 'error', message: 'Failed to communicate with robot' });
    }
});

// 啟動服務器
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
