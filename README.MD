### Environment Variable

```
PORT=3001
MONGODB_URI="mongodb://betest:hPHPAjdRd9kjqnN7@localhost:27017/db_hansinsusatya_betest"
SECRET_KEY="secretkey"
REDIS_PASSWORD="supersecureredis"
```

### Start Redis and MongoDB

#### Make sure you have installed docker on your machine
Run this script
```
docker-compose up -d 
```

### Run service
```
npm run dev
```