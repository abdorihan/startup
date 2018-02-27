import express from 'express';
import { getData, getElement, editElement, deleteElement, addElement } from './data'; // then changed to provider
import permit from '../../permission';

import Busboy from 'busboy';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// load data
router.get('/', permit('load_emp'), (req, res) => {
    getData().then(data => {
        res.json(data);
    });
});

router.get('/:id', permit('load_emp'), (req, res) => {
    getElement(req.params.id).then((result) => {
        if (!result.element) {
            res.status(404).end();
        } else {
            if (fs.existsSync(path.join('./public/img/emp/', req.params.id))) {
                result.element.image = `/img/emp/${req.params.id}`;
            }
            res.json(result);
        }
    });
});

router.put('/:id', permit('edit_emp'), async(req, res) => {
    try {
        const element = {};
        const busboy = new Busboy({ headers: req.headers });
        busboy.on('file', (fieldname, file) => {
            const saveTo = path.join('./public/img/emp/', req.params.id);
            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on('field', (fieldname, val) => {
            if (val !== 'null') {
                element[fieldname] = val;
            }
        });
        busboy.on('finish', () => {
            delete element.image;
            editElement(req.params.id, element).then((result) => {
                if (!result.ok) {
                    res.status(400).json(result);
                } else {
                    res.json(result);
                }
            });
        });
        return req.pipe(busboy);
    } catch (e) {
        console.log(e);
    }
});

router.delete('/:id', permit('delete_emp'), (req, res) => {
    deleteElement(req.params.id).then((result) => {
        if (!result.ok) {
            res.status(404).end();
        } else {
            fs.unlink(path.join('./public/img/emp/', req.params.id), () => {});
            res.json(result);
        }
    });
});

router.post('/', permit('add_emp'), (req, res) => {
    try {
        let saveTo;
        const element = {};
        const busboy = new Busboy({ headers: req.headers });
        busboy.on('file', (fieldname, file) => {
            saveTo = path.join('./public/img/emp/', 'temp');
            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on('field', (fieldname, val) => {
            if (val !== 'null') {
                element[fieldname] = val;
            }
        });
        busboy.on('finish', () => {
            delete element.image;
            addElement(element).then((result) => {
                if (!result.ok) {
                    res.status(400).json(result);
                } else {
                    if (saveTo) {
                        fs.rename(saveTo, path.join('./public/img/emp/', String(result.insertId)), (err) => {
                            if (err) console.log(err);
                        });
                    }
                    res.json(result);
                }
            });
        });
        return req.pipe(busboy);
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
