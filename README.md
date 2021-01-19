# DSD04-Notification IT4883-20201
các chức năng về thông báo

### Config
set your config on /.env file
```
mongoURI=your-mongo-uri
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