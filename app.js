const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app=express();
const host='0.0.0.0';
const port=3000;

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешить доступ с любого источника
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Разрешить методы запросов
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Разрешить заголовки

    next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2901myDB',
    database: 'mydatabase'
});

connection.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных: ' + err.stack);
        return;
    }

    console.log('Подключение к базе данных успешно установлено');
});


app.get('/api/stats', (req, res) => {
    const sqlQuery = "SELECT id, task_name, time_spent FROM tasks_employee";

    connection.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Ошибка при получении списка задач', error: err });
            return;
        }
        res.json(result);
    });
});
app.post('/api/add_task', (req, res) => {
    const {task_name} = req.body;
    const sqlQuery = "INSERT INTO tasks_employee (task_name, time_spent) VALUES (?, '00:00:00')";

    connection.query(sqlQuery, [task_name], (err, result) => {
        if (err) throw err;
        res.send('Task added successfully');
    });
});

app.get('/api/tasks_employee', (req, res) => {
    const sqlQuery = "SELECT id, task_name, time_spent FROM tasks_employee";

    connection.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Ошибка при получении списка задач', error: err });
            return;
        }
        res.json(result);
    });
});

app.post('/api/update_time', (req, res) => {
    const { task_id, time_spent } = req.body;
    const sqlQuery = "UPDATE tasks_employee SET time_spent = ? WHERE id = ?";

    console.log('Received update for task_id %s with time_spent %s',task_id,time_spent);

    connection.query(sqlQuery, [time_spent, task_id], (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Ошибка при обновлении времени задачи', error: err });
            return;
        }
        res.status(200).send({ message: 'Время задачи успешно обновлено' });
    });
});


app.listen(port, host, () => {
    console.log('Server running http://$d:%d',host,port);
});