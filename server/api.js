import express from 'express';
import { addSession, getTasks, getTask, getSession } from './data';
import Validator from '../utils/validator';
import Database from '../utils/database';

const router = express.Router();
const db = new Database();


router.post('/sessions', async (req, res) => {
    const { email, password } = req.body;
    const result = {};
    const error = await Validator.error(email, [Validator.email]) || await Validator.error(password, [Validator.required]);
    if (error) {
        res.statusMessage = error;
        res.status(404).end();
    } else {
        const name = email.split('@')[0].replace(/\.|_/, ' '); // simulated
        const now = new Date();
        const sql = 'SELECT prevs, emp_id from `employee` NATURAL JOIN `job` WHERE emp_email = ? AND password = SHA1 (?)';
        await db.query(sql, [email, password]).then((rows) => {
            if (rows.length === 1 && rows[0].prevs.indexOf('login') !== -1) {
                const token = `token-${now.getTime()}`; // simulated
                result.element = { prevs: rows[0].prevs, emp_id: rows[0].emp_id, email, name, token };
            } else {
                result.msg = Validator.getMessage('invalid_login');
            }
        }).catch(err => {
            console.log(err);
            result.msg = err.message;
        });
        if (result.element) {
            addSession(result.element.token, result.element);
            res.json(result);
        } else {
            res.statusMessage = result.msg;
            res.status(401).end();
        }
    }
});

router.get('/task', (req, res) => {
    getTasks(req.query).then(tasks => res.json(tasks));
});

router.get('/task/:id', (req, res) => {
    getTask(req.params.id).then((result) => {
        if (!result.task) {
            res.status(404).end();
        } else {
            res.json(result);
        }
    });
});

router.delete('/sessions/*', (req, res) => {
    res.json(undefined);
});

router.put('/sessions', (req, res) => {
    res.json({ ok: getSession(req.headers.auth) !== undefined });
});

module.exports = router;
