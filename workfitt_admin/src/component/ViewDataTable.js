import { Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import "./viewTable.css";

export default function ViewDataTable(props) {
  return (
    <div className="viewTable">
      <Table
        aria-label="Example table with custom cells"
        css={{
          height: "auto",
           minWidth: "100%",
          backgroundColor:"White"
        }}
        className="dataTable"
        selectionMode="none"

      >
        <Table.Header columns={props.columns}>
          {(column) => (
            <Table.Column
              key={column.uid}
              // hideHeader={column.uid === "actions"}
              align={"center"}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={props.dataArr} className="viewTableCell">
          {(item) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell css={{textAlign:"center"}}>{props.renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
        {props.dataArr && props.dataArr.length > 10 &&
          <Table.Pagination
            shadow
            noMargin
            align="center"
            rowsPerPage={10}
            onPageChange={(page) => console.log({ page })}
            total={Math.ceil(props.dataArr.length/10)}
          />}
      </Table>
    </div>
  );
}
