import { Button, type TableProps, Modal, Table } from "antd";
import type { ReactNode, Key } from "react";
import { useState } from "react";

export type RowKeyFn<T> = (row: T, index?: number) => Key;
export interface BatchTaskResultModalProps<T = object> {
  rowKey: RowKeyFn<T>;

  title?: string;

  downloadText?: string;

  data: T[];
  /**
   * 成功数
   */
  successNumber?: number;
  /**
   * 失败数
   */
  failedNumber?: number;

  columns: TableProps<T>["columns"];

  onDownload?: () => void;

  width?: number;
}

export const BatchTaskResultModal = <T,>(props: BatchTaskResultModalProps<T>): ReactNode => {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      open={open}
      title={props.title ?? "失败结果"}
      centered
      width={props.width ?? 640}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <div className="mb-2 flex w-full">
        <div>
          {props.successNumber != null && (
            <span className="peer">
              成功：
              <span className="text-success">{props.successNumber}</span> 条
            </span>
          )}
          {props.failedNumber != null && (
            <span className="ml-2 inline-block">
              失败：
              <span className="text-danger">{props.failedNumber}</span> 条
            </span>
          )}
        </div>
        <div className="flex-auto"></div>
        {props.onDownload != null && (
          <Button type="link" size="small" onClick={props.onDownload}>
            {props.downloadText ?? "下载失败订单"}
          </Button>
        )}
      </div>
      <Table rowKey={props.rowKey} dataSource={props.data} columns={props.columns} pagination={false}></Table>
    </Modal>
  );
};
