db = db.getSiblingDB('db_hansinsusatya_betest');

db.createUser({
    user: 'betest',
    pwd: 'hPHPAjdRd9kjqnN7',
    roles: [
        {
            role: 'readWrite',
            db: 'db_hansinsusatya_betest',
        },
    ],
});