import * as React from "react";
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import {io} from "cucumber-messages";
import IDataTable = io.cucumber.messages.IDataTable;

interface IDataTableProps {
    dataTable?: IDataTable | null
}

const DataTable: React.SFC<IDataTableProps> = ({dataTable}) => {
    if (!dataTable) { return null }
    return (
        <Table>
            <TableBody>
                {(dataTable.rows || []).map((row, i) => (
                    <TableRow key={i}>
                        {(row.cells || []).map((cell, j) => (
                            <TableCell key={j}>
                                <pre>{cell.value}</pre>
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default DataTable
