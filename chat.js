(function() {
  var chatContent = '// INSERT HERE';
  var iframe = document.createElement('iframe');
  iframe.style.cssText = "border: none; position: fixed; right: 0; bottom: 0; width: 100%; height: 100%; z-index: 9998;"
  var html = '<body>Foo</body>';
  document.body.appendChild(iframe);
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(chatContent);
  iframe.contentWindow.document.close();
})()
