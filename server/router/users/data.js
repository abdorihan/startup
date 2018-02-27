import Validator from '../../../utils/validator';
import Database from '../../../utils/database';

const db = new Database();

const validationHeader = [
    { accessor: 'emp_name', validators: [Validator.required] },
    { accessor: 'emp_email', validators: [Validator.email] },
    { accessor: 'emp_gender', validators: [Validator.binary] },
    { accessor: 'emp_phone', validators: [Validator.phone] }
];

const tableName = 'employee';
const idColumn = 'emp_id';

export async function getData () {
    const result = {};
    await db.selectAll(tableName).then((rows) => {
        result.data = rows;
    }).catch(err => {
        result.msg = err.message;
    });
    return Promise.resolve(result);
}

export async function getElement (id) {
    const result = {};
    await db.selectOne(tableName, idColumn, id).then((rows) => {
        result.element = rows[0];
        delete result.element.password;
    }).catch(err => {
        console.log(err);
        result.msg = err.message;
    });
    return Promise.resolve(result);
}

export async function editElement (id, element) {
    const result = { ok: false, msg: Validator.validate(element, validationHeader) };
    if (result.msg === true) {
        delete element[idColumn];
        await db.update(tableName, element, { [idColumn]: id }).then((res) => {
            if (res.affectedRows === 1) {
                result.ok = true;
                result.idColumn = idColumn;
            }
        }).catch(err => {
            if (err.code === 'ER_DUP_ENTRY') {
                result.msg = Validator.getMessage('email_is_taken');
            } else {
                result.msg = err.message;
            }
        });
    }
    return Promise.resolve(result);
}

export async function deleteElement (id) {
    const result = { ok: false };
    await db.delete(tableName, { [idColumn]: id }).then((res) => {
        if (res.affectedRows > 0) {
            result.ok = true;
            result.idColumn = idColumn;
        }
    }).catch(err => {
        result.msg = err.message;
    });
    return Promise.resolve(result);
}

export async function addElement (element) {
    const result = { ok: false };
    element[idColumn] = null;
    await db.insertOne(tableName, element).then((res) => {
        if (res.affectedRows === 1) {
            element[idColumn] = res.insertId;
            result.element = element;
            result.ok = true;
            result.insertId = res.insertId;
        }
    }).catch(err => {
        if (err.code === 'ER_DUP_ENTRY') {
            result.msg = Validator.getMessage('email_is_taken');
        } else {
            result.msg = err.message;
        }
    });
    return Promise.resolve(result);
}

export default { getElement, getData, editElement, deleteElement, addElement };
