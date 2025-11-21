function doPost(e) {
  try {
    Logger.log('--- NUEVA RESERVA (FIXED) ---');
    // e.parameter holds single values, e.parameters holds arrays
    Logger.log(JSON.stringify(e.parameters));

    const ss = SpreadsheetApp.openById('1lksuFoxJ6fqmitTzY-WaCyLn-ls41R_tPzoeBBrxo7E');
    const sheet = ss.getSheetByName('Respuestas');

    // Use e.parameter for single fields
    const p = e.parameter;
    const nombre    = p.nombre    || '';
    const telefono  = p.telefono  || '';
    const correo    = p.correo    || '';
    const instagram = p.instagram || '';
    const plan      = p.plan      || '';

    // Use e.parameters for checkboxes (clases)
    // This ensures we get ALL selected classes, not just the first one
    let clasesArr = [];
    if (e.parameters.clases) {
      clasesArr = e.parameters.clases;
    }
    const clasesTexto = clasesArr.join(', ');

    const CLASS_MAP = [
      'Sábado 11:00 · Fullbody · Wanda Monsalve',
      'Sábado 11:00 · Yoga · Mari Méndez',
      'Sábado 16:00 · Pilates · Lisbeida Rangel',
      'Sábado 17:00 · Stretching · Lisbeida Rangel',
      'Sábado 18:00 · Yoga · Mari Méndez',
      'Domingo 11:00 · Fullbody · Wanda Monsalve',
      'Domingo 11:00 · Yoga · Mari Méndez',
      'Domingo 16:00 · Pilates · Lisbeida Rangel',
      'Domingo 17:00 · Stretching · Lisbeida Rangel',
      'Domingo 18:00 · Yoga · Mari Méndez',
    ];

    const clasesFlags = CLASS_MAP.map(label =>
      clasesArr.includes(label) ? 1 : ''
    );

    // --- FILE UPLOAD HANDLING (BASE64) ---
    let fileUrl = '';
    
    // Check if we have the hidden fields populated
    if (p.fileData && p.fileName) {
      try {
        const folder = DriveApp.getFolderById('1DmFDNqrbLbMqol_wo9E0WJGSX0RYBztJ');
        
        const safeName = (nombre || 'sin_nombre').replace(/[^\w\s-]/g, '_');
        const timestamp = Utilities.formatDate(
          new Date(),
          Session.getScriptTimeZone(),
          'yyyyMMdd_HHmmss'
        );
        
        const finalName = timestamp + '_' + safeName + '_' + p.fileName;
        
        // Decode Base64
        const decodedBytes = Utilities.base64Decode(p.fileData);
        const blob = Utilities.newBlob(decodedBytes, p.fileMimeType || 'application/octet-stream', finalName);
        
        const file = folder.createFile(blob);
        fileUrl = file.getUrl();
        Logger.log('Archivo creado OK: ' + fileUrl);
        
      } catch (errFile) {
        Logger.log('Error guardando archivo Base64: ' + errFile);
        fileUrl = 'Error: ' + errFile.toString();
      }
    } else {
      Logger.log('No se recibieron datos de archivo (fileData/fileName)');
    }

    const row = [
      new Date(),
      nombre,
      telefono,
      correo,
      instagram,
      plan,
      clasesTexto,
      ...clasesFlags,
      fileUrl
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, fileUrl }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Error en doPost: ' + err);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
