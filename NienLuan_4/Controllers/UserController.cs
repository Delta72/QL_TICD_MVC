using Newtonsoft.Json;
using NienLuan_4.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NienLuan_4.Controllers
{
    public class UserController : Controller
    {
        Database_Entities db = new Database_Entities();
        // GET: User
        public ActionResult UserHomePage()
        {
            return View();
        }

        // Lay ten hien thi
        public ActionResult getUserName()
        {
            string tk = "";
            if (User.Identity.IsAuthenticated)
            {
                tk = db.TAIKHOANs.Where(a => a.ID_TK == User.Identity.Name).Select(a => a.TENHIENTHI_TK).FirstOrDefault();
            }
            else
            {
                tk = "";
            }
            var report = JsonConvert.SerializeObject(tk, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        // Lay avatar
        public ActionResult getUserAvatar()
        {
            string link;
            if (!User.Identity.IsAuthenticated)
            {
                link = "/Content/Images/UserProfile/AnoAvatar.png";
            }
            else
            {
                string id = db.TAIKHOANs.Where(a => a.ID_TK == User.Identity.Name).Select(a => a.ID_TK).FirstOrDefault();
                link = db.HINHANHs.Where(a => a.ID_TK == id).Select(a => a.LINK_HA).FirstOrDefault();
                if(link == null || link == "")
                {
                    link = "/Content/Images/UserProfile/AnoAvatar.png";
                }
            }
            var report = JsonConvert.SerializeObject(link, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        // Lay role
        public ActionResult getuserRole()
        {
            string role = "";
            if (!User.Identity.IsAuthenticated)
            {
                role = "ano";
            }
            else
            {
                string id = User.Identity.Name;
                TAIKHOAN T = db.TAIKHOANs.Where(a => a.ID_TK == id).FirstOrDefault();
                int r = T.ID_LOAITK;
                if(r == 3)
                {
                    role = "ad";
                }
                else if(r == 1)
                {
                    role = "cn";
                }
                else
                {
                    role = "dn";
                }
            }
            var report = JsonConvert.SerializeObject(role, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        // Select list loai dich vu
        public ActionResult selectLoaiDVu()
        {
            List<LOAIDIADIEM> L = db.LOAIDIADIEMs.OrderBy(a => a.TEN_LOAIDD).ToList();         
            var report = JsonConvert.SerializeObject(L, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        

        // Xem ban do cong dong

    }
}