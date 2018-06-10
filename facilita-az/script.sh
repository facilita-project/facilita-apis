func azure functionapp publish FacilitaList
func azure functionapp publish FacilitaInsert
func new --language JavaScript --template "Http Trigger" --name FacilitaInsert
FacilitaList=FacilitaInsert
# cd $FacilitaInsert
rm ${FacilitaList}.zip && zip -r . ${FacilitaList}

rm facilitaaz.zip && zip -r facilitaaz .
az functionapp deployment source config-zip \
                            -g mshackathonciab-23 -n facilitafn \
                            --src facilitaaz.zip
# cd ..
endpoint=$(az cosmosdb show \
  --name hackathonciab \
  --resource-group mshackathonciab-23 \
  --query documentEndpoint \
  --output tsv)

#   https://hackathonciab.documents.azure.com:443/

  key=$(az cosmosdb list-keys \
  --name hackathonciab \
  --resource-group mshackathonciab-23 \
  --query primaryMasterKey \
  --output tsv)
