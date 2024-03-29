/*!
 * FakeCookiebot.js
 *
 * Copyright (c) 2024 Jan Wassermann
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use strict";

if (typeof(window.Cookiebot) === "undefined")
{
    window.Cookiebot = (function()
    {
        var fakeCookiebot = function()
        {
            var that = this;

            /* getCookie and set Cookie heavily inspired by
             * https://www.w3schools.com/js/js_cookies.asp
             */
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
                                + ";" + expires + ";path=/;"
                                + "SameSite=Strict;Secure;";
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
