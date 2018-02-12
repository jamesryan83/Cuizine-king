Option Explicit

On Error Resume Next

RunExcelMacro

Sub RunExcelMacro()

  Dim xlApp
  Dim xlBook

  Set xlApp = CreateObject("Excel.Application")
  Set xlBook = xlApp.Workbooks.Open("C:\Code\projects\Menuthing\website\data\Fakedata.xlsm", 0, True)
  xlApp.Run "CreateSql"
  xlApp.Quit

  Set xlBook = Nothing
  Set xlApp = Nothing

End Sub