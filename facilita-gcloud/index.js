/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START functions_ocr_setup]
const config = require('./config.json');

// Get a reference to the Pub/Sub component
const pubsub = require('@google-cloud/pubsub')();
// Get a reference to the Cloud Storage component
const storage = require('@google-cloud/storage')();
// Get a reference to the Cloud Vision API component
const vision = require('@google-cloud/vision')();
// Get a reference to the Translate API component
const translate = require('@google-cloud/translate')();

const Buffer = require('safe-buffer').Buffer;
// [END functions_ocr_setup]

// [START functions_ocr_publish]
/**
 * Publishes the result to the given pubsub topic and returns a Promise.
 *
 * @param {string} topicName Name of the topic on which to publish.
 * @param {object} data The message data to publish.
 */
function publishResult(topicName, data) {
  return pubsub.topic(topicName).get({
      autoCreate: true
    })
    .then(([topic]) => topic.publish(data));
}
// [END functions_ocr_publish]

// [START functions_ocr_detect]
/**
 * Detects the text in an image using the Google Vision API.
 *
 * @param {string} bucketName Cloud Storage bucket name.
 * @param {string} filename Cloud Storage file name.
 * @returns {Promise}
 */
function detectText(url) {
  let text;

  console.log(`Looking for text in image [${url}]`);
  return vision.textDetection({
      source: {
        // imageUri: `gs://${bucketName}/${filename}`
        imageUri: url || `https://i.imgur.com/7leulqA.png`
      }
    })
    .then(([detections]) => {
      console.log('detections', detections.textAnnotations[0].description.toString())
      const data = detections.textAnnotations[0].description.split("PREFEITURA DO MUNICÍPIO DE SÃO PAULO")[1].split('\n')[2].slice(0, 11)
      console.log('Data: ', data)
      const nome = detections.textAnnotations[0].description.split("Social:")[1].trim().split('\n')[0]
      console.log('Nome: ', nome)
      const CNPJ = detections.textAnnotations[0].description.split("CPF/CNPJ:")[1].trim().slice(0, 19)
      console.log('CNPJ: ', CNPJ)
      let valor1 = detections.textAnnotations[0].description
        .split('VALOR TOTAL DO SERVIÇO R$')
      if (valor1.length === 1) {
        valor1 = detections.textAnnotations[0].description
          .split('VALOR TOTAL DO SERVIÇO = R$')
      }

      if (valor1.length === 1) {
        valor1 = detections.textAnnotations[0].description
          .split('VALOR TOTAL DA NOTA R$')
      }
      const valor = valor1[1]
        .split('\n')[0].replace('.', "")
        .replace(',', '.').trim()

      console.log('Valor: ', valor)



      return {
        data,
        CNPJ,
        valor,
        nome
      }
    })

}
// [END functions_ocr_detect]

// [END functions_ocr_rename]

// [START functions_ocr_process]
/**
 * Cloud Function triggered by Cloud Storage when a file is uploaded.
 *
 * @param {object} event The Cloud Functions event.
 * @param {object} event.data A Google Cloud Storage File object.
 */
exports.processImage = (req, res) => {
  let file = req.body;

  return Promise.resolve()
    .then(() => {

      if (!file.url) {
        throw new Error('Buckurlet not provided. Make sure you have a "url" property in your request');
      }


      return detectText(file.url);
    }).then((result) => {
      return res.send(result)
    }).catch((error) => {
      return res.send({
        error: error
      })
    })

};
// [END functions_ocr_process]