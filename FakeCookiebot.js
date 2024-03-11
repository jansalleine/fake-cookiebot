"use strict";

if (typeof(window.Cookiebot) === "undefined")
{
    window.Cookiebot = (function()
    {
        var fakeCookiebot = function()
        {
            var that = this;

            function getCookie(cname)
            {
                var name = cname + "=",
                    decodedCookie = decodeURIComponent(document.cookie),
                    ca = decodedCookie.split(';');

                for(var i = 0; i < ca.length; i++)
                {
                    var c = ca[i];

                    while (c.charAt(0) == ' ')
                    {
                        c = c.substring(1);
                    }

                    if (c.indexOf(name) == 0)
                    {
                        return c.substring(name.length, c.length);
                    }
                }

                return "";
            }

            function setCookie(cname, cvalue, exdays)
            {
                var d = new Date();

                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

                var expires = "expires="+ d.toUTCString();

                document.cookie = cname + "=" + cvalue
                                + ";" + expires + ";path=/";
            }

            var cookie = getCookie("fakeCookiebot");

            if (cookie === "")
            {
                this.consent = {
                    "marketing":    false,
                    "necessary":    true,
                    "preferences":  false,
                    "statistics":   false
                };
            }
            else
            {
                this.consent = JSON.parse(cookie);
            }

            this.event = document.createEvent("Event");
            this.event.initEvent("CookiebotOnAccept", true, true);

            this.renew = function()
            {
                var cookie = getCookie("fakeCookiebot");

                if (cookie === "") cookie = JSON.stringify(this.consent);

                var tmpConsent = JSON.parse(cookie);

                tmpConsent.marketing    = !tmpConsent.marketing;
                tmpConsent.preferences  = !tmpConsent.preferences;
                tmpConsent.statistics   = !tmpConsent.statistics;

                setCookie(
                    "fakeCookiebot",
                    JSON.stringify(tmpConsent),
                    365
                );

                this.consent = tmpConsent;

                window.dispatchEvent(this.event);
            }

            window.addEventListener(
                "load",
                function(e)
                {
                    window.dispatchEvent(that.event);
                }
            );
        }
        return new fakeCookiebot();
    })();
}
