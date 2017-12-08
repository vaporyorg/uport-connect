'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uportQRDisplay = exports.getQRDataURI = exports.openQr = exports.closeQr = undefined;

var _qrImage = require('qr-image');

var _qrImage2 = _interopRequireDefault(_qrImage);

var _assets = require('./assets.js');

var _assets2 = _interopRequireDefault(_assets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**  @module uport-connect/util/qrdisplay
 *  @description
 *  A set of QR utility functions and default displays to use with Connect.
 */

/**
 *  Given a string of data it returns a image URI which is a QR code. An image
 *  URI can be displayed in a img html tag by setting the src attrbiute to the
 *  the image URI.
 *
 *  @param    {String}     data      data string, typically a uPort URI
 *  @return   {String}               image URI
 */
var getQRDataURI = function getQRDataURI(data) {
  var pngBuffer = _qrImage2.default.imageSync(data, { type: 'png' });
  return 'data:image/png;charset=utf-8;base64, ' + pngBuffer.toString('base64');
};

/**
 *  A default QR pop over display, which injects the neccessary html
 *
 *  @param    {String}     data       data which is displayed in QR code
 *  @param    {Function}   cancel     a function called when the cancel button is clicked
 *  @param    {String}     appName    name of the users app
 *  @param    {Boolean}    introModal a flag for displaying the intro
 */
var openQr = function openQr(data, cancel, appName, introModal, explanation) {

  var wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'uport-wrapper');

  wrapper.innerHTML = introModal ? introModalDisplay(appName) : uportQRDisplay({ qrImageUri: getQRDataURI(data), cancel: cancel, explanation: explanation });

  var cancelClick = function cancelClick(event) {
    document.getElementById('uport-qr-text').innerHTML = 'Cancelling';
    cancel();
  };

  var uportTransition = function uportTransition(event) {
    wrapper.innerHTML = uportQRDisplay({ qrImageUri: getQRDataURI(data), cancel: cancel });
    document.getElementById('uport-qr-cancel').addEventListener('click', cancelClick);
  };

  document.body.appendChild(wrapper);
  document.getElementById('uport-qr-cancel').addEventListener('click', cancelClick);
  if (introModal) {
    document.getElementById('uport-continue-btn').addEventListener('click', uportTransition);
  }
};

/**
 *  Closes the default QR pop over
 */
var closeQr = function closeQr() {
  var uportWrapper = document.getElementById('uport-wrapper');
  document.body.removeChild(uportWrapper);
};

/**
 *  The first content you will see in the modal
 *
 *  @param    {String}     appNamme  Name of users uPort App
 *  @return   {Object}     populated modal
 */
var introModalDisplay = function introModalDisplay(appName) {
  var content = '\n    <div style="' + uportModalIntroWrapper + '">\n      <div>\n        <p id="uport-qr-text" style="' + uportQRTextWithAppName + '">';

  if (appName && appName !== 'uport-connect-app') {
    content += '\n              <span>Login Into</span>\n              <span> </span>\n              <span style="' + uportAppName + '">' + appName + '</span>';
  } else {
    content += '<span>Login</span>';
  }

  content += '\n            </p>\n          </div>\n        <div id="uport-continue-btn" style="' + uportModalContinueBtn + '">\n          <span style="' + uportModalLogo + '">' + _assets2.default.logo + '</span>\n          <span>&nbsp;&nbsp;</span>\n          <span>Continue with uPort</span>\n        </div>\n\n    </div>\n\n    <div style="' + uportModalNewUserFooterCSS + '">\n      <p style="' + uportModalNewUserFooterTitleCSS + '">New uPort User?</p>\n      <div style="' + uportModalNewUserFooterAppStoresCSS + '">\n        <a href="' + googleStoreLink + '" target="_blank"><div style="' + uportModalNewUserFooterAppStoresAndroidCSS + '">' + _assets2.default.androidApp + '</div></a>\n        <a href="' + apppleStoreLink + '" target="_blank"><div style="' + uportModalNewUserFooterAppStoresiOSCSS + '">' + _assets2.default.appleApp + '</div></a>\n      </div>\n    </div>\n  ';

  return uportModal(content);
};

/**
 *  A html pop over QR display template
 *
 *  @param    {Object}     args
 *  @param    {String}     args.qrImageUri    a image URI for the QR code
 */
var uportQRDisplay = function uportQRDisplay(_ref) {
  var qrImageUri = _ref.qrImageUri,
      explanation = _ref.explanation;
  return uportModal('\n  <div>\n    <div style="' + uportLogoWithBg + '">' + _assets2.default.logowithBG + '</div>\n    <p id="uport-qr-text" style="' + uportQRInstructions + '">Scan QR code with uPort Mobile App</p>\n    <p id="uport-qr-text" style="' + uportQRInstructions + '">' + explanation + '</p>\n    <img src="' + qrImageUri + '" style="' + uportQRIMG + '" />\n  </div>\n');
};

/**
 *  Modal skeleton
 *
 *  @param    {String}     innerHTML    content of modal
 */
var uportModal = function uportModal(innerHTML) {
  return '\n  <div id="uport-qr" style="' + uportQRCSS + '">\n    <div style="' + uportModalCSS + '" class="animated fadeIn">\n      <div style="' + uportModalHeaderCSS + '">\n        <div id="uport-qr-cancel" style="' + uportModalHeaderCloseCSS + '">\n          ' + _assets2.default.close + '\n        </div>\n      </div>\n      <div>\n        ' + innerHTML + '\n      </div>\n    </div>\n    ' + animateCSS + '\n  </div>\n';
};

/**
 *  animateCSS CSS
 */
var animateCSS = '\n<style>\n  @keyframes fadeIn {\n    from { opacity: 0; }\n    to { opacity: 1; }\n  }\n  .animated {\n    animation-duration: 1s;\n    animation-fill-mode: both;\n  }\n  .fadeIn {\n    animation-name: fadeIn;\n  }\n</style>\n';

/**
 *  uportQRCSS CSS
 */
var uportQRCSS = '\n  position:fixed;\n  top: 0;\n  width:100%;\n  height:100%;\n  z-index:100;\n  background-color:rgba(0,0,0,0.5);\n  text-align:center;\n';

/**
 *  uportModalCSS CSS
 */
var uportModalCSS = '\n  position:relative;\n  top:50%;\n  display:inline-block;\n  z-index:101;\n  background:#fff;\n  transform:translateY(-50%);\n  margin:0 auto;\n  border-radius: 8px;\n  overflow: hidden;\n  box-shadow: 0 12px 24px 0 rgba(0,0,0,0.1);\n  min-width: 400px;\n';

/**
 *  uportModalHeaderCSS CSS
 */
var uportModalHeaderCSS = '\n  width: 100%;\n  height: 45px;\n';

/**
 *  uportModalHeaderCloseCSS CSS
 */
var uportModalHeaderCloseCSS = '\n  float: right;\n  height: 25px;\n  width: 25px;\n  margin: 15px;\n  cursor: pointer;\n';

/**
 *  uportModalNewUserFooterCSS CSS
 */
var uportModalNewUserFooterCSS = '\n  background-color: #F6F7F8;\n  padding: 26px 0;\n  min-height: 110px;\n';

/**
 *  uportModalNewUserFooterTitleCSS CSS
 */
var uportModalNewUserFooterTitleCSS = '\n  font-size: 14px;\n  color: #7C828B;\n  font-family: Avenir;\n';

/**
 *  uportModalNewUserFooterAppStoresCSS CSS
 */
var uportModalNewUserFooterAppStoresCSS = '\n  padding: 10px 42px;\n';

/**
 *  uportModalNewUserFooterAppStoresAndroidCSS CSS
 */
var uportModalNewUserFooterAppStoresAndroidCSS = '\n  width: 128px;\n  height: 40px;\n  margin-right: 20px;\n  display: inline-block;\n';

/**
 *  uportModalNewUserFooterAppStoresiOSCSS CSS
 */
var uportModalNewUserFooterAppStoresiOSCSS = '\n  width: 128px;\n  height: 40px;\n  display: inline-block;\n';

/**
 *  uportModalLogo CSS
 */
var uportModalLogo = '\n  display:inline-block;\n  max-width: 50px;\n  vertical-align: middle;\n';

/**
 *  uportAppName CSS
 */
var uportAppName = '\n  font-weight: 700;\n';

/**
 *  uportQRTextWithAppName CSS
 */
var uportQRTextWithAppName = '\n  font-size: 18px;\n  color: #7C828B;\n  font-family: Avenir;\n';

/**
 *  uportLogoWithBg CSS
 */
var uportLogoWithBg = '\n  width: 60px;\n  height: 60px;\n  margin: 0 auto 0 auto;\n';

/**
 *  uportQRInstructions CSS
 */
var uportQRInstructions = '\n  color: #7C828B;\n  font-family: Avenir;\n  padding: 0 10px;\n  font-size: 18px;\n  text-align: center;\n  margin-top: 0;\n';

/**
 *  uportModalIntroWrapper CSS
 */
var uportModalIntroWrapper = '\n  text-align: center;\n  display: inline-block;\n  width: 100%;"\n';

/**
 *  uportQRIMG CSS
 */
var uportQRIMG = '\n  z-index:102;\n  margin-bottom: 35px;\n';

/**
 *  uportModalContinueBtn CSS
 */
var uportModalContinueBtn = '\n  text-align: center;\n  padding: 17px 25px 17px 25px;\n  border-radius: 6px;\n  color: #fff;\n  margin: 75px auto 80px 0;\n  font-family: arial, sans-serif;\n  font-weight: 500;\n  letter-spacing: 0.8px;\n  border-color: #4f45af;\n  text-shadow: none;\n  background-color: #5C50CA;\n  background-position: left 18px bottom 11px;\n  background-repeat: no-repeat;\n  border: 1px solid #ccc;\n  cursor: pointer;\n  display: inline-block;\n  position: relative;\n  white-space: nowrap;\n  box-sizing: border-box;\n  font-size: 16px;\n  text-decoration: noneuser-select: none;\n  transition: border-color 0.1s linear,background 0.1s linear,color 0.1s linear;\n  -o-transition: border-color 0.1s linear,background 0.1s linear,color 0.1s linear;\n  -ms-transition: border-color 0.1s linear,background 0.1s linear,color 0.1s linear;\n';

var apppleStoreLink = 'https://itunes.apple.com/us/app/uport-id/id1123434510?mt=8';
var googleStoreLink = 'https://play.google.com/store/apps/details?id=com.uportMobile';

/**
 *  export
 */
exports.closeQr = closeQr;
exports.openQr = openQr;
exports.getQRDataURI = getQRDataURI;
exports.uportQRDisplay = uportQRDisplay;