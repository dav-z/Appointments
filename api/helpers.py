def cursor_json_list(cursor, exclude_null=False, exclude_cols=[]):
    headers = [x[0] for x in cursor.description]
    results = cursor.fetchall()

    return_list= []
    for result in results:
        return_obj = {}
        result = list(result)
        for i in range(len(headers)):
            if((exclude_null and result[i] is None) or headers[i] in exclude_cols):
                continue
            return_obj[headers[i]] = result[i]
        return_list.append(return_obj)

    return return_list
