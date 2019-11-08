import React from 'react';

function SummaryTab(props) {

    function renderSummaryData(root, depth) {
        var data = props.calculateSummaryData(root.key);
        return (
            <React.Fragment key={root.key}>
                <tr key={root.key}>
                    <td>{indent(root.content, depth)}</td>
                    <td>{data.progress}</td>
                    <td>{data.remaining}</td>
                    <td>{data.total}</td>
                    <td>{data.percent}</td>
                </tr>
                {root.children.map(node => {
                    return renderSummaryData(node, depth+1)
                })}
            </React.Fragment> 
        );
    }

    function indent(content, num) {
        var indented = content;
        for (var i = 0; i < num; i++) {
            indented = '----' + indented;
        }
        return indented;
    }

    function renderSummaryTable() {
        return (
            <table
                width="100%"
            >
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Progress</th>
                        <th>Remaining</th>
                        <th>Total</th>
                        <th>% Complete</th>
                    </tr>
                </thead>

                <tbody>
                    {renderSummaryData(props.retrieveNode(props.data, props.selected), 0)}
                </tbody>
            </table>
        );
    }

    return (
        <div margin="16px">
            {renderSummaryTable()}
        </div>
    );
}

export default SummaryTab;