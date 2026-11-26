using System.Net;
using System.Net.Mail;

namespace _31241023360_HoGiaBao.Extension;

public class EmailServiceNew
{
    /// <summary>
    /// Gửi email sử dụng máy chủ SMTP Google (smtp.gmail.com)
    /// </summary>
    public static async Task<bool> SendMailGoogleSmtp(string _from, string _to, string _subject,
        string _body, string _gmailsend, string _gmailpassword)
    {
        using var client = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential(_gmailsend, _gmailpassword),
            EnableSsl = true
        };
        return await SendMail(_from, _to, _subject, _body, client);
    }

    /// <summary>
    /// Gửi email qua một SmtpClient đã cấu hình
    /// </summary>
    public static async Task<bool> SendMail(string _from, string _to, string _subject, string _body, SmtpClient client)
    {
        var message = new MailMessage(from: _from, to: _to, subject: _subject, body: _body)
        {
            BodyEncoding = System.Text.Encoding.UTF8,
            SubjectEncoding = System.Text.Encoding.UTF8,
            IsBodyHtml = true
        };
        message.ReplyToList.Add(new MailAddress(_from));
        message.Sender = new MailAddress(_from);

        try
        {
            await client.SendMailAsync(message);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
    }
}
