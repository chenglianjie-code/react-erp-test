import type { ColInfo, ExcelDataType } from "xlsx";

export type Nullable<T> = T | null;

export class XlsxService {
  async toXlsx(data: Array<Nullable<string>[]>, options: DownloadOptions) {
    const { utils, writeFile } = await import("xlsx");
    data.unshift(options.headers);

    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(data);

    worksheet["!cols"] = options.columns;

    // 设置单元格格式
    if (options.colFormats) {
      for (const format of options.colFormats) {
        for (let R = 1; R < data.length; ++R) {
          const cellAddress = utils.encode_cell({
            c: format.columnIndex,
            r: R,
          });

          if (!worksheet[cellAddress]) {
            continue;
          }

          worksheet[cellAddress].z = format.format;
          if (format.t) {
            worksheet[cellAddress].t = format.t;
          }
        }
      }
    }

    utils.book_append_sheet(workbook, worksheet);

    writeFile(workbook, options.filename);
  }
}

export const xlsxService = new XlsxService();

export interface DownloadOptions {
  filename: string;

  headers: string[];

  columns?: ColInfo[];

  colFormats?: ColumnFormat[];
}

export interface ColumnFormat {
  /**
   * 列索引，例如 0 表示第一列
   */
  columnIndex: number;
  /**
   * 单元格格式，例如 'yyyy-mm-dd hh:mm:ss'
   */
  format: string;
  /**
   * 单元格数据类型
   *
   * 'b': 布尔值
   * 'n': 数字
   * 'e': 错误
   * 's': 字符串
   * 'd': 日期
   * 'z': 空
   */
  t?: ExcelDataType;
}
