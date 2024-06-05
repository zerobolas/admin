import React from "react";
import { Table, Skeleton } from "@mui/joy";

type TableSkeletonProps = {
  rows?: number;
  cols?: number;
};

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 50,
  cols = 4,
}: TableSkeletonProps) => {
  return (
    <Table
      borderAxis="xBetween"
      size="md"
      stickyFooter={false}
      stickyHeader={false}
      variant="plain"
    >
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, index) => (
            <th key={index}>
              <Skeleton variant="text" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, index) => (
          <tr key={index}>
            {Array.from({ length: cols }).map((_, index) => (
              <td key={index}>
                <Skeleton
                  variant="text"
                  width={`${Math.floor(Math.random() * 100) + 20}%`}
                  sx={{ maxWidth: "100%" }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableSkeleton;
