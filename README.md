# DSD04-Notification IT4883-20201
các chức năng về thông báo

### Config
set your config on /.env file
```
mongoURI=your-mongo-uri
```

### Check dịch vụ
sau khi deploy lên heroku, heroku sẽ tự start server.
##### kiểm tra trạng thái server, gõ lệnh

```sh 
$ heroku logs
```
sẽ hiển thị trạng thái sau: 
```
2021-01-19T10:59:50.495590+00:00 heroku[web.1]: Starting process with command `npm start`
2021-01-19T10:59:54.075959+00:00 app[web.1]:
2021-01-19T10:59:54.075972+00:00 app[web.1]: > dsd04-notification@1.0.0 start /app
2021-01-19T10:59:54.075972+00:00 app[web.1]: > node server.js
2021-01-19T10:59:54.075973+00:00 app[web.1]:
2021-01-19T10:59:55.731699+00:00 app[web.1]: App is running on port 30958
2021-01-19T10:59:55.810829+00:00 heroku[web.1]: State changed from starting to up
2021-01-19T10:59:56.206558+00:00 app[web.1]: MongoDB connected
```
##### Bảng trạng thái
| trạng thái   |     thành công      |  lỗi |
|----------|:-------------:|------:|
| dịch vụ  |  State changed from starting to up | thông báo khác |
| database |    MongoDB connected   |   thông báo khác |

##### khởi động lại server bị lỗi 
```sh 
$ heroku restart
```

### Import Database
Để thực hiện chức năng này hãy chắc chắn là admin của database, với tên là <name_admin>, password là <password_admin>, cluster có link là <cluster_link>, import vào database có tên <db_name>, với collection cần import có tên là <collection_name>, và có file cần import có đường dẫn <path_to_file_import>, định dạng json

```sh
$ mongoimport --uri mongodb+srv://<name_admin>:<password_admin>@<cluster_link>/<db_name> --collection <collection_name> --type json --file <path_to_file_import> --jsonArray
```

Ví dụ
```cmd
$ mongoimport --uri mongodb+srv://thanh:passwordHere@cluster0.pvk4h.gcp.mongodb.net/dsd04 --collection notifications --type json --file database/DSD_04/notifications.json --jsonArray
$ mongoimport --uri mongodb+srv://thanh:passwordHere@cluster0.pvk4h.gcp.mongodb.net/dsd04 --collection subscriptions --type json --file database/DSD_04/subscriptions.json --jsonArray
```
### Installation 
```sh
$ npm install
```
### Run
#### On development environment
```sh
$ npm run dev
```
#### On deployment environment
```sh
$ npm run start
```
### API
please link API docs (postman): [link](https://documenter.getpostman.com/view/12799829/TVmLBJM8)