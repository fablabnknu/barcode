import pandas as pd
import json

# 讀取Excel檔案
excel_file = 'data.xlsx'  # 請根據實際的Excel檔案名稱修改

# 讀取多個活頁表
df_sheet1 = pd.read_excel(excel_file, sheet_name='Sheet1')
df_sheet2 = pd.read_excel(excel_file, sheet_name='Sheet2')
df_sheet3 = pd.read_excel(excel_file, sheet_name='Sheet3')
# 將每個活頁表轉換為JSON格式
json_sheet1 = df_sheet1.to_json(orient='records', force_ascii=False)  # 甲組
json_sheet2 = df_sheet2.to_json(orient='records', force_ascii=False)  # 乙組
json_sheet3 = df_sheet3.to_json(orient='records', force_ascii=False)  # 乙組

# 將JSON數據寫入不同的檔案
with open('groupA.json', 'w', encoding='utf-8') as f:
    f.write(json_sheet1)

with open('groupB.json', 'w', encoding='utf-8') as f:
    f.write(json_sheet2)

with open('groupC.json', 'w', encoding='utf-8') as f:
    f.write(json_sheet3)

print("活頁表已成功轉換為 JSON 檔案。")