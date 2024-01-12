export function getDateFromISOString(dateStr: string = '') {
  var result: string;

  const strSplit: string[] = dateStr.split('T');
  
  if (strSplit.length > 0)
    result = strSplit[0];
  else {
    const dateISO: string = new Date().toISOString();
    result = dateISO.split('T')[0];
  }

  return result;
};