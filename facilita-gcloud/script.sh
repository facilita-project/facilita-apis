gcloud beta functions deploy ocr-extract --trigger-bucket nfe-ew --entry-point processImage
gcloud beta functions deploy ocr-extract2  --trigger-http --entry-point processImage

gcloud beta functions deploy ocr-save --trigger-topic nfe-ew --entry-point saveResult
gsutil cp ~/Desktop/horizonfour-05-06.png gs://nfe-ew
gcloud beta functions logs read --limit 100

gcloud beta functions call ocr-extract2 --data '{"url":"https://i.imgur.com/7leulqA.png"}'
https://us-central1-hackciab-206802.cloudfunctions.net/ocr-extract2 


https://i.imgur.com/7leulqA.png

https://i.imgur.com/WNjyof7.png