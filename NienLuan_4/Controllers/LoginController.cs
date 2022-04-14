using Newtonsoft.Json;
using NienLuan_4.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace NienLuan_4.Controllers
{
    public class LoginController : Controller
    {
        QL_TICD_Entities db = new QL_TICD_Entities();
        // GET: Login

        [AllowAnonymous]
        public ActionResult Login(string tk, string mk)
        {
            Boolean check = false;
            TAIKHOAN TK = db.TAIKHOANs.Where(a => a.TAIKHOAN_TK == tk).FirstOrDefault();
            if(TK == null || TK.MATKHAU_TK != mk)
            {
                check = false;
            }            
            else
            {
                check = true;               
                FormsAuthentication.SetAuthCookie(TK.ID_TK, false);
            }
            var r = JsonConvert.SerializeObject(check, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(r, "application/json");
        }

        [Authorize]
        public ActionResult LogOut()
        {
            FormsAuthentication.SignOut();
            Boolean check = false;
            var r = JsonConvert.SerializeObject(check, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(r, "application/json");
        }

        public ActionResult Error()
        {
            return View();
        }

        public ActionResult isExist(string tk)
        {
            Boolean isExistAccount = false;
            TAIKHOAN Acc = db.TAIKHOANs.Where(a => a.TAIKHOAN_TK == tk).FirstOrDefault();
            if(Acc != null)
            {
                isExistAccount = true;
            }
            var r = JsonConvert.SerializeObject(isExistAccount, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(r, "application/json");
        }

        public ActionResult CreateAccount(string ltk, string tk, string mk, string email)
        {
            Boolean Success = false;
            int loai; int.TryParse(ltk, out loai);
            TAIKHOAN TK = new TAIKHOAN()
            {
                ID_TK = Guid.NewGuid().ToString(),
                ID_LOAITK = loai,
                TAIKHOAN_TK = tk,
                MATKHAU_TK = mk,
                EMAIL_TK = email,
                SDT_TK = "",
                TENHIENTHI_TK = tk,
                NGAYTAO_TK = DateTime.Now,
                LANHDCUOI_TK = DateTime.Now,
                DAKHOA_TK = false
            };
            db.TAIKHOANs.Add(TK);
            db.SaveChanges();
            var r = JsonConvert.SerializeObject(Success, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(r, "application/json");
        }

        public ActionResult isLogon()
        {
            Boolean l = false;
            if (User.Identity.IsAuthenticated)
            {
                l = true;
            }
            else
            {
                l = false;
            }
            var report = JsonConvert.SerializeObject(l, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }
    }
}