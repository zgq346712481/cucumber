import * as React from "react";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {io} from "cucumber-messages";
import ITableRow = io.cucumber.messages.ITableRow;

interface IExamplesTableProps {
    tableHeader?: ITableRow | null
    tableBody?: ITableRow[] | null
}

const ExamplesTable: React.SFC<IExamplesTableProps> = ({tableHeader, tableBody}) => {
    if (!tableHeader) {
        return null
    }
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {(tableHeader.cells || []).map((cell, j) => (
                        <TableCell key={j}>
                            <pre>{cell.value}</pre>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {(tableBody || []).map((row, i) => (
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

export default ExamplesTable
