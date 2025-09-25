import { Table, Modal, Button, type TableProps } from "antd";
import { useEffect, useState, type Key, type ReactNode } from "react";

export interface BatchImportTaskResultProps<T = object> {
  downloadable?: boolean;

  rowKey: (item: T) => Key;

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

  failPath?: string;
  open?: boolean;
}

export const BatchImportTaskResultModal = <T,>(props: BatchImportTaskResultProps<T>): ReactNode => {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      open={open}
      title={props.title ?? "失败结果"}
      centered
      width={720}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      {props.downloadable && (
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
            <span className="text-warning ml-[16px]">注：最多显示前500条失败记录，可下载EXCEL查看完整记录</span>
          </div>
          <div className="flex-auto"></div>
          {props.failPath && (
            <Button type="link" size="small" href={props.failPath}>
              {props.downloadText ?? "下载失败订单"}
            </Button>
          )}
        </div>
      )}
      <Table border rowKey={props.rowKey} dataSource={props.data} columns={props.columns} pagination={false}></Table>
    </Modal>
  );
};
