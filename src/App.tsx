import * as React from "react";
import * as _ from "lodash";

type AppState = {
    data2: Data[],
    hiddenGroupings: string[]
}



export default class App extends React.Component<{}, AppState> {
    state = {
        data2: data,
        hiddenGroupings: []
    }

    render() {
        const { data2, hiddenGroupings } = this.state;

        // We have an ordered list of attributes we want to do something with, and what we should do with the values.
        // columns
        const columns = [
            { property: "category", action: "group", order: 1, },
            { property: "department", action: "sum", order: 2, },
            { property: "type", action: "group", order: 3, },
            { property: "ref", action: "group", order: 4, },
            { property: "colour", action: "hide", order: 5, },
            { property: "sno", action: "hide", order: 6, },
            { property: "warehouse", action: "hide", order: 7, },
            { property: "branchGrade", action: "hide", order: 8, },
            { property: "branch", action: "hide", order: 9, },
            { property: "week", action: "group", order: 10, },
            { property: "value", action: "sum", order: 11, }
        ];

        // Can decide which columns to group by and the order
        // Then decide which columns to aggregate by, and how



        const groups = ["category", "department", "type", "ref", "colour", "sno", "warehouse", "branchGrade", "branch", "week"];
        const groupedValues = {};
        for (const row of data2) {
            // 
            for (const group of groups) {
                groupedValues.push({

                })
            }
        }
        const aggregates = [
            { property: "value", action: (array, x) => array.reduce() },
            { property: "sno", action: x => }
        ];
        const groupings = [];
        // group by all, each time we group do something with the values
        for (const group of groups) {
            const result = _.chain(data2).groupBy(group).map((data, grouping) => { }).value();
            groupings.push(result);
        }
        // foreach item in the array, group by item, add some values;
        let groupedArray = [{}];
        for (var group of groups) {
            for (var row of groupedArray) {
                groupedArray = _.chain(data2).groupBy(group).map((data, grouping) => ({
                    category: "",
                    value: _.sumBy(data, x => x.value),
                    key: 
                })).value();
            }
        }
        const grouped = data2.reduce((result, data) => {
            groups.reduce((group, key, i, { length }) => {
                // rolling value, current item, current index, length of array
                return group[data[key]] = group[data[key]] || (i + 1 === length ? [] : {})
            }, result).push(data);
            return result;
        }, {});

        console.log(grouped);

        const test: Data[] = [];
        // Function takes groupings array, index, until empty populate all values with next value?
        // Populate all value types
        for (const group of groupings) {
            _.chain(data2).groupBy(group).map((datas, groupProperty) => ({

            }));
        }
        const catGroup: Data[] = _.chain(data2).groupBy(x => x.category).map((datas, category) => ({
            id: null,
            category: category,
            department: "",
            type: "",
            ref: "",
            colour: "",
            sno: "",
            warehouse: "",
            branchGrade: "",
            branch: "",
            week: null,
            value: _.sumBy(datas, x => x.value),
            ids: _.map(datas, x => x.id),
            datas: _.chain(datas).groupBy(x => x.department).map((depRows, department) => ({
                id: null,
                category: "",
                department: department,
                type: "",
                ref: "",
                colour: "",
                sno: "",
                warehouse: "",
                branchGrade: "",
                branch: "",
                week: null,
                value: _.sumBy(depRows, x => x.value),
                ids: _.map(depRows, x => x.id),
                datas: _.chain(datas).groupBy(x => x.type).map((typeRows, type) => ({
                    id: null,
                    category: "",
                    department: "",
                    type: type,
                    ref: "",
                    colour: "",
                    sno: "",
                    warehouse: "",
                    branchGrade: "",
                    branch: "",
                    week: null,
                    value: _.sumBy(typeRows, x => x.value),
                    ids: _.map(typeRows, x => x.id),
                })).value()
            })).value()
        })).value();

        const deptGroup: Data[] = _.chain(data2).groupBy(x => `${x.category}-${x.sno}`).map((datas, group) => ({
            id: datas[0].id,
            category: datas[0].category,
            department: datas[0].department,
            type: "",
            ref: "",
            colour: "",
            sno: datas[0].sno,
            warehouse: "",
            branchGrade: "",
            branch: "",
            week: null,
            value: _.sumBy(datas, x => x.value),
            ids: _.map(datas, x => x.id),
            datas: datas
        })).value();

        const weekGroup: Data[] = _.chain(data2).groupBy(x => `${x.category}-${x.week}`).map((datas, group) => ({
            id: datas[0].id,
            category: datas[0].category,
            department: datas[0].department,
            type: "",
            ref: "",
            colour: "",
            sno: null,
            warehouse: "",
            branchGrade: "",
            branch: "",
            week: datas[0].week,
            value: _.sumBy(datas, x => x.value),
            ids: _.map(datas, x => x.id),
            datas: datas
        })).value();

        return (
            <React.Fragment>
                <div className="container-fluid">
                    {nestedTable("category", catGroup, this.updateValue, data2, this.toggleRow, hiddenGroupings)}
                    {table(catGroup, this.updateValue, data2)}
                    {table(deptGroup, this.updateValue, data2)}
                    {table(weekGroup, this.updateValue, data2)}
                    {table(data2, this.updateValue, data2)}
                </div>
            </React.Fragment>
        )
    }

    toggleRow = (groupingKey: string) => {
        let rows = [...this.state.hiddenGroupings];
        if (rows.some(x => x === groupingKey))
            rows.splice(rows.indexOf(groupingKey), 1);
        else
            rows.push(groupingKey);

        this.setState({ hiddenGroupings: rows });
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

const nestedRow = (groupingKey: string, rows: Data[], updateValue: Function, allRows: Data[], toggleRow: Function, hiddenGroups: string[]) =>
    rows.map(x => <React.Fragment><tr key={x.id} onClick={() => toggleRow(groupingKey)} style={{ backgroundColor: x.datas ? "lightgrey" : "white" }}>
        <td>{x.category}</td>
        <td>{x.department}</td>
        <td>{x.type}</td>
        <td>{x.ref}</td>
        <td>{x.colour}</td>
        <td>{x.sno}</td>
        <td>{x.warehouse}</td>
        <td>{x.branchGrade}</td>
        <td>{x.branch}</td>
        <td>{x.week}</td>
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
        }}>{Math.round(x.value)}</td>
    </tr>
        {x.datas && !hiddenGroups.some(y => y === groupingKey) && nestedRow(groupingKey, x.datas, updateValue, allRows, toggleRow, hiddenGroups)}
    </React.Fragment>
    );

const nestedTable = (grouping: string, rows: Data[], updateValue: Function, allRows: Data[], toggleRow: Function, hiddenGroupings: string[]) =>
    <table className="table table-sm collapse show">
        <thead>
            <tr>
                <th>Category</th>
                <th>Department</th>
                <th>Type</th>
                <th>Ref</th>
                <th>Colour</th>
                <th>Sno</th>
                <th>Warehouse</th>
                <th>BranchGrade</th>
                <th>Branch</th>
                <th>Week</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            {nestedRow(grouping, rows, updateValue, allRows, toggleRow, hiddenGroupings)}
        </tbody>
    </table>

const table = (rows: Data[], updateValue: Function, allRows: Data[]) =>
    <table className="table table-sm collapse show">
        <thead>
            <tr>
                <th>Category</th>
                <th>Department</th>
                <th>Type</th>
                <th>Ref</th>
                <th>Colour</th>
                <th>Sno</th>
                <th>Warehouse</th>
                <th>BranchGrade</th>
                <th>Branch</th>
                <th>Week</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            {rows.map(x => <tr key={x.id}>
                <td>{x.category}</td>
                <td>{x.department}</td>
                <td>{x.type}</td>
                <td>{x.ref}</td>
                <td>{x.colour}</td>
                <td>{x.sno}</td>
                <td>{x.warehouse}</td>
                <td>{x.branchGrade}</td>
                <td>{x.branch}</td>
                <td>{x.week}</td>
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
                }}>{Math.round(x.value)}</td>
            </tr>)}
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







