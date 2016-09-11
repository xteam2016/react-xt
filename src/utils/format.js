// 数据格式化
import verify from './verify'
var format = {
  money: function(input) {
    if (!verify.isNumber(input)) {
      return input
    }
    input = input.toString().replace(/\$|\,/g, '');
    if (isNaN(input))
      input = "0";
    var sign = (input == (input = Math.abs(input)));
    input = Math.floor(input * 100 + 0.50000000001);
    var cents = input % 100;
    input = Math.floor(input / 100).toString();
    if (cents < 10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((input.length - (1 + i)) / 3); i++)
      input = input.substring(0, input.length - (4 * i + 3)) + ',' +
      input.substring(input.length - (4 * i + 3));
    return (((sign) ? '' : '-') + input + '.' + cents);
  },
  date: function(date, format){
    if(!date || date == 'Invalid Date'){
      return '';
    }
      format = format || 'yyyy-mm-dd';
      return format.replace(/y+/i, date.getFullYear())
          .replace(/m+/, ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1))
          .replace(/d+/, (date.getDate() < 10 ? "0" : "") + date.getDate())
          .replace(/H+/, (date.getHours() < 10 ? "0" : "") + date.getHours())
          .replace(/M+/, (date.getMinutes() < 10 ? "0" : "") + date.getMinutes())
          .replace(/S+/, (date.getSeconds() < 10 ? "0" : "") + date.getSeconds());

  }
}
export default format;