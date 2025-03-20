import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { google, sheets_v4 } from "googleapis";
import * as path from "path";

@Injectable()
export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;

  constructor(private configService: ConfigService) {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(
        this.configService.get("GOOGLE_APPLICATION_CREDENTIALS_FILE_NAME") || ""
      ),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth });
  }

  async addEventToSheet(sheetRange: string, rowData: string[] = []) {
    return this.sheets.spreadsheets.values.append({
      spreadsheetId: this.configService.get("SPREADSHEET_ID"),
      range: sheetRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[...rowData]],
      },
    });
  }

  async getAllEventsFromSheet(sheetRange: string) {
    const sheetEventReponse = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.configService.get("SPREADSHEET_ID"),
      range: sheetRange,
    });
    return sheetEventReponse.data.values;
  }

  async getEventRowIndexFromSheet(sheetRange: string, eventId: string) {
    // Implementation for getting event from sheet
    const sheetEventReponse = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.configService.get("SPREADSHEET_ID"),
      range: sheetRange,
    });
    const sheetDatas: string[][] = sheetEventReponse.data.values || [[]];
    const uuidIndex = sheetDatas[0]?.findIndex(
      (column: string) => column === "uuid"
    );

    const foundSheetIndex = sheetDatas.findIndex((row: string[]) => {
      return row[uuidIndex] === eventId;
    });

    if (foundSheetIndex > -1) return foundSheetIndex + 1;
    throw new Error("uuid column not found");
  }

  async getEventFromSheet(sheetRange: string) {
    const sheetEventReponse = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.configService.get("SPREADSHEET_ID"),
      range: sheetRange,
    });
    return sheetEventReponse.data.values?.[0] || null;
  }

  async updateEventInSheet(sheetRange: string, rowData: any) {
    const sheetEventReponse = await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.configService.get("SPREADSHEET_ID"),
      valueInputOption: "USER_ENTERED",
      range: sheetRange,
      requestBody: { values: [[...rowData]] },
    });
    return sheetEventReponse.data;
    // Implementation for updating event in sheet
  }

  async deleteEventFromSheet(sheetRange: string, eventId: string) {
    await this.sheets.spreadsheets.values.clear({
      spreadsheetId: this.configService.get("SPREADSHEET_ID"),
      range: sheetRange,
    });
  }
}
