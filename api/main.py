import pymysql
import simplejson
from app import app
from helpers import cursor_json_list
from flask import jsonify
from flask import flash, request
from datetime import datetime
import time
import mysql.connector

# configuration data
config = {
    'user': 'root',
    'password': 'root',
    'host': 'db',
    'port': '3306',
    'database': 'scheduler'
}

# get method of listing all appointments
@app.route('/appointments', methods=['GET'])
def appointments():
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        query = "SELECT * FROM appointments"
        print(query)
        cursor.execute(query)
        print(query)
        res = cursor_json_list(cursor)
        print(res)
        print(jsonify(res))
        ret = jsonify(res)
        ret.status_code = 200
        return ret
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

# get method of getting singular appointment by id
@app.route('/appointment/<int:id>', methods=['GET'])
def appointment(id):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        query = "SELECT * FROM appointments WHERE id=%s" % id
        cursor.execute(query)
        res = cursor_json_list(cursor)
        ret = jsonify(res)
        ret.status_code = 200
        return ret
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

# post method of adding appointment
@app.route('/add_appointment', methods=['POST'])
def add_appointment():
    try:
        _json = request.json
        _customer = _json['customer']
        _time = datetime.strptime(_json['time'], '%Y-%m-%d %H:%M:%S')
        _price = _json['price']
        if(_json['notes']):
            _notes = _json['notes']
        else:
            _notes = None
        if _customer and _time and request.method == 'POST':
            query = "INSERT INTO appointments(customer, time, price, notes) VALUES(%s, %s, %s, %s)"
            bindData = (_customer, _time, _price, _notes)
            conn = mysql.connector.connect(**config)
            cursor = conn.cursor()
            cursor.execute(query, bindData)
            conn.commit()
            ret = jsonify(cursor.lastrowid)
            ret.status_code = 200
            return ret
        else:
            return not_found()
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

# put method of updating existing appointment
@app.route('/update_appointment/<int:id>', methods=['PUT'])
def update_appointment(id):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        _json = request.json
        _customer = _json['customer']
        _time = datetime.strptime(_json['time'], '%Y-%m-%d %H:%M:%S')
        _price = _json['price']
        _status = _json['status']
        now = time.localtime()
        _update = time.strftime('%Y-%m-%d %H:%M:%S', now)
        if(_json['notes']):
            _notes = _json['notes']
        else:
            _notes = None
        if _price and _time and _status and request.method == 'PUT':
            bindData = (_customer, _time, _notes, _price, _status, _update, id)
            query = "UPDATE appointments SET customer=%s, time=%s, notes=%s, price=%s, status=%s, updated_at=%s WHERE id=%s"
            cursor.execute(query, bindData)
            conn.commit()
            respone = jsonify('Appointment updated successfully!')
            respone.status_code = 200
            return respone
        else:
            return not_found()
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

# delete method of removing appointment
@app.route('/delete_appointment/<int:id>', methods=['DELETE'])
def delete_appointment(id):
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        query = "DELETE FROM appointments WHERE id=%s" % id
        cursor.execute(query)
        conn.commit()
        respone = jsonify('Appointment deleted successfully!')
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

# post method of search (using post to send search data)
@app.route('/search', methods=['POST'])
def search():
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        _json = request.json
        _start= datetime.strptime(_json['start'], '%Y-%m-%d %H:%M:%S')
        _end = datetime.strptime(_json['end'], '%Y-%m-%d %H:%M:%S')
        print(_start)
        print(_end)
        if _start and _end and request.method == 'POST':
            query = "SELECT * FROM appointments WHERE time BETWEEN %s AND %s ORDER BY price ASC"
            dates = (_start, _end)
            cursor.execute(query, dates)
            res = cursor_json_list(cursor)
            ret = jsonify(res)
            ret.status_code = 200
            return ret
        else:
            return not_found()
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Record not found: ' + request.url,
    }
    respone = jsonify(message)
    respone.status_code = 404
    return respone


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
