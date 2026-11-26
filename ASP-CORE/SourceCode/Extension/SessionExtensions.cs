using Newtonsoft.Json;

namespace _31241023360_HoGiaBao.Extension;

public static class SessionExtensions
{
    public static void Set<T>(this ISession session, string key, T value)
    {
        session.SetString(key, JsonConvert.SerializeObject(value, Formatting.Indented,
            new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            }));
    }

    public static T Get<T>(this ISession session, string key)
    {
        var value = session.GetString(key);
        return value == null ? Activator.CreateInstance<T>() : JsonConvert.DeserializeObject<T>(value);
    }
}
