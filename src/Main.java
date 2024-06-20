import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class Main extends Application {
    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("AGV Remote Control");

        VBox vbox = new VBox();

        // 中上方兩個矩形框
        Button statusButton = new Button("執行狀態");
        Button busyButton = new Button("忙碌中");
        vbox.getChildren().addAll(statusButton, busyButton);

        // 中下方四個矩形框按鈕
        Button btn1 = new Button("送醫材");
        Button btn2 = new Button("播放衛教影片");
        Button btn3 = new Button("進行引導");
        Button btn4 = new Button("去充電");

        btn1.setOnAction(e -> System.out.println("送醫材 button pressed"));
        btn2.setOnAction(e -> System.out.println("播放衛教影片 button pressed"));
        btn3.setOnAction(e -> System.out.println("進行引導 button pressed"));
        btn4.setOnAction(e -> System.out.println("去充電 button pressed"));

        vbox.getChildren().addAll(btn1, btn2, btn3, btn4);

        Scene scene = new Scene(vbox, 300, 200);
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
