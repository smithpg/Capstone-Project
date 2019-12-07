import React from 'react';

function SummaryTab(props) {

    function renderSummaryDataFromProject(root, depth) {
        root.tree.map(node => {
            return (
                renderSummaryDataFromTask(node, depth+1)
            );
        })
    }

    function indent(content, num) {
        var indented = content;
        for (var i = 0; i < num; i++) {
            indented = '----' + indented;
        }
        return indented;
    }

    function renderSummaryDataFromTask(root, depth) {
        console.log(root)
        var data = calculateSummaryData(root._id);
        return (
            <React.Fragment key={root.key}>
                <tr key={root.key}>
                    <td>{indent(root.title, depth)}</td>
                    <td>{data.progress}</td>
                    <td>{data.remaining}</td>
                    <td>{data.total}</td>
                    <td>{data.percent}</td>
                </tr>
                {root.children.map(node => {
                    return renderSummaryDataFromTask(node, depth+1)
                })}
            </React.Fragment> 
        );
    }

    function selectSummaryData() {
        if (props.selectedTask !== null && props.selectedTask != undefined) {
            return renderSummaryDataFromTask(props.selectedTask, 0)
        } else if (props.selectedProject != null && props.selectedProject !== undefined) {
            return renderSummaryDataFromProject(props.selectedProject, 0)
        }
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
                    {selectSummaryData()}
                </tbody>
            </table>
        );
    }

    return (
        <div margin="16px">
            {renderSummaryTable()}
        </div>
    );

    // calculate summary data for a node
    // progress is summation of all progress datapoints
    // remaining is most recent remaining datapoint
    function calculateSummaryData(id) {

        function traverse(root) {
            var summaryData = {};
            if (root.reports.length > 0) {
                summaryData.progress = sumProgress(root.reports);
                summaryData.remaining = props.sortTrackingData(root.reports)[root.reports.length-1].remaining;
                summaryData.total = summaryData.progress + summaryData.remaining;
                summaryData.percent = percentComplete(summaryData.progress, summaryData.total);
            } else {
                summaryData.progress = 0;
                summaryData.remaining = 0;
                summaryData.total = 0;
                summaryData.percent = "0%";
            }
            for (var i = 0; i < root.children.length; i++) {
                var childData = traverse(root.children[i]);
                summaryData.progress +=  childData.progress;
                summaryData.remaining += childData.remaining;
                summaryData.total = summaryData.progress + summaryData.remaining;
                summaryData.percent = percentComplete(summaryData.progress, summaryData.total);
            }
            return summaryData;
        }

        function percentComplete(progress, total) {
            if (total === 0) {
                return '0%'
            } else {
                return String(Math.round(100 * 100 * progress / total) / 100) + '%';
            }
        }

        function sumProgress(data) {
            var sum = 0;
            data.map(p => sum += p.progress);
            return sum;
        }

        const node = props.retrieveNode(id)
        return traverse(node);
    }

    
}

export default SummaryTab;