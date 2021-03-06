import * as React from "react";
import * as _ from "lodash";

type AppState = {
    data2: Data[],
    columns: ActionProperty[]
}

const recursiveGroup = (rows: Data[], groupKeys: string[], groupKeyIndex: number, columns: ActionProperty[]): any[] => {
    if (groupKeyIndex === groupKeys.length) return null;

    return _.chain(rows).groupBy(groupKeys[groupKeyIndex]).map((groupedRows, groupKey) => {
        const row = {};
        row["datas"] = recursiveGroup(groupedRows, groupKeys, groupKeyIndex + 1, columns);

        for (const prop of columns) {
            row[prop.property] = aggregateSwitch(row, prop.action, groupedRows, prop.property, groupKeys[groupKeyIndex], groupKey);
        }
        return row;
    }).value();
}

type ActionProperty = {
    property: string;
    action: ActionType;
    editable: boolean;
    editFunction?: Function;
}

type ActionType = "GROUP" | "HIDE" | "SUM" | "DISTINCT" | "AVERAGE" | "COUNT" | "PROPERTY";

const aggregateSwitch = (row: any, action: ActionType, rows: Data[], property: string, currentGroupingProperty: string, currentGroupingValue: string) => {
    switch (action) {
        case "SUM":
            return _.sumBy(rows, x => x[property]);
        case "DISTINCT":
            return _.uniqBy(rows, x => x[property]).map(x => x[property]).join(", ");
        case "AVERAGE":
            return _.meanBy(rows, x => x[property]);
        case "GROUP":
            return currentGroupingProperty === property ? currentGroupingValue : null;
        case "HIDE":
            return null;
        case "PROPERTY":
            return !row.datas || row.datas.length === 0 ? parseInt(rows[0][property]) : null;
    }
}

const findLowestData = (rows: Data[]): Data[] => {
    const rowsToReturn = [];
    for (const row of rows) {
        if (!row.datas || row.datas.length === 0)
            rowsToReturn.push(row);
        else
            rowsToReturn.concat(findLowestData(rows));
    }

    return rowsToReturn;
}

export default class App extends React.Component<{}, AppState> {
    state = {
        data2: data,
        columns: [
            { property: "id", action: "PROPERTY", editable: false },
            { property: "category", action: "GROUP", editable: false },
            { property: "department", action: "GROUP", editable: false },
            { property: "type", action: "GROUP", editable: false },
            { property: "ref", action: "GROUP", editable: false },
            { property: "colour", action: "GROUP", editable: false },
            { property: "week", action: "GROUP", editable: false },
            { property: "sno", action: "GROUP", editable: false },
            {
                property: "value", action: "SUM", editable: true, editFunction: (e, oldRow) => {
                    const oldValue = oldRow.value;
                    const newValue = Math.round(parseInt(e.currentTarget.innerText));

                    const rowsToUpdate = !oldRow.datas || oldRow.datas.length === 0 ? [oldRow] : findLowestData(oldRow);
                    for (let row of rowsToUpdate) {
                        row.value = Math.round((row.value / oldValue) * newValue);
                    }

                    console.log("rowsToUpdate: ", rowsToUpdate);
                    this.updateValue(rowsToUpdate);
                }
            },
        ] as ActionProperty[]
    }

    render() {
        const { data2, columns } = this.state;
        console.log(data2.filter(x => x.id === 1));

        // Can decide which columns to group by and the order
        // Then decide which columns to aggregate by, and how
        const groups = columns.filter(x => x.action === "GROUP").map(x => x.property);
        const groupedRows = recursiveGroup(data2, groups, 0, columns);
        return (
            <React.Fragment>
                <div className="container-fluid">
                    {nestedTable("category", groupedRows, this.updateValue, data2, this.toggleRow, columns)}
                </div>
            </React.Fragment>
        )
    }

    toggleRow = (groupingKey: string) => {

    }

    updateValue = (data: Data[]) => {
        let newRows = [...this.state.data2];
        for (let row1 of newRows) {
            for (var row of data) {
                row1 = row.id === row1.id ? row : row1;
            }
        }

        this.setState({ data2: newRows });
    }
}

const nestedRow = (groupingKey: string, rows: Data[], updateValue: Function, allRows: Data[], toggleRow: Function, columns: ActionProperty[]) =>
    rows.map(x => <React.Fragment><tr key={x.id} style={{ backgroundColor: x.datas ? "lightgrey" : "white" }}>
        {columns.map(y => <td contentEditable={y.editable} onBlur={(e) => y.editFunction(e, x)} onClick={() => toggleRow(groupingKey)}>{x[y.property]}</td>)}
        {/* 
        <td suppressContentEditableWarning={true} contentEditable={true} onBlur={(e) => {
            const oldValue = x.value;
            const newValue = Math.round(parseInt(e.currentTarget.innerText));

            if (x.ids && x.ids.length > 0) {
                const children = allRows.filter(x1 => x.ids && x.ids.some(y => y === x1.id));
                for (let child of children) {
                    child.value = Math.round((child.value / oldValue) * newValue);
                }
                updateValue(children);
            } else {
                x.value = newValue;
                // get new value, 
                updateValue([x]);
            }
        }}>{Math.round(x.value)}</td> */}
    </tr>
        {x.datas && nestedRow(groupingKey, x.datas, updateValue, allRows, toggleRow, columns)}
    </React.Fragment>
    );

const nestedTable = (grouping: string, rows: Data[], updateValue: Function, allRows: Data[], toggleRow: Function, columns: ActionProperty[]) =>
    <table className="table table-sm collapse show">
        <thead>
            <tr>
                {columns.map(x => <th>{x.property}</th>)}
            </tr>
        </thead>
        <tbody>
            {nestedRow(grouping, rows, updateValue, allRows, toggleRow, columns)}
        </tbody>
    </table>

const data: Data[] = [
    { id: 1, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "01", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 1, value: 20 },
    { id: 2, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "01", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 2, value: 20 },
    { id: 3, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "01", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 3, value: 20 },
    { id: 4, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "01", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 4, value: 20 },
    { id: 5, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "01", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 5, value: 20 },
    { id: 6, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "01", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 6, value: 20 },

    { id: 7, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "02", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 1, value: 20 },
    { id: 8, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "02", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 2, value: 20 },
    { id: 9, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "02", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 3, value: 20 },
    { id: 10, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "02", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 4, value: 20 },
    { id: 11, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "02", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 5, value: 20 },
    { id: 12, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "02", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 6, value: 20 },

    { id: 13, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "03", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 1, value: 20 },
    { id: 14, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "03", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 2, value: 20 },
    { id: 15, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "03", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 3, value: 20 },
    { id: 16, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "03", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 4, value: 20 },
    { id: 17, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "03", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 5, value: 20 },
    { id: 18, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "03", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 6, value: 20 },

    { id: 19, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "04", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 1, value: 20 },
    { id: 20, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "04", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 2, value: 20 },
    { id: 21, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "04", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 3, value: 20 },
    { id: 22, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "04", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 4, value: 20 },
    { id: 23, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "04", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 5, value: 20 },
    { id: 24, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "04", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 6, value: 20 },

    { id: 25, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "05", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 1, value: 20 },
    { id: 26, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "05", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 2, value: 20 },
    { id: 27, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "05", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 3, value: 20 },
    { id: 28, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "05", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 4, value: 20 },
    { id: 29, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "05", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 5, value: 20 },
    { id: 30, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "05", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 6, value: 20 },

    { id: 31, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "06", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 1, value: 20 },
    { id: 32, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "06", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 2, value: 20 },
    { id: 33, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "06", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 3, value: 20 },
    { id: 34, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "06", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 4, value: 20 },
    { id: 35, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "06", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 5, value: 20 },
    { id: 36, category: "MEN", department: "CTC", type: "OUT", ref: "123456", colour: "BLA", sno: "06", warehouse: "AAA", branchGrade: "AFFTOWN", branch: "ABG", week: 6, value: 20 },

]

type Data = {
    id: number;
    category: string;
    department: string;
    type: string;
    ref: string;
    colour: string;
    sno: string;
    warehouse: string;
    branchGrade: string;
    branch: string;
    week: number;
    value: number;
    ids?: number[];
    datas?: Data[];
}







