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
        QL_TICD_Entities db = new QL_TICD_Entities();
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
            List<string> str = new List<string>();
            foreach(var a in db.LOAIDIADIEMs)
            {
                string s = a.TEN_LOAIDD;
                str.Add(s);
            }
            var report = JsonConvert.SerializeObject(str, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        // Doanh nghiep them dia diem
        [HttpPost]
        public JsonResult AddMarker(addMarkerModel model) 
        {
            var success = false;
            DIADIEM D = new DIADIEM();
            string idtk = db.TAIKHOANs.Where(a => a.ID_TK == User.Identity.Name).Select(a => a.ID_TK).FirstOrDefault();
            D.ID_DD = Guid.NewGuid().ToString();
            D.ID_TK = idtk;
            D.ID_LOAIDD = int.Parse(model.loai);
            D.ID_PX = int.Parse(model.idpx);
            D.TEN_DD = model.name;
            D.TOADO_DD = model.coor;
            D.MOTA_DD = model.mota;
            D.LUOTTHICH_DD = 0;
            D.NGAYTHEM_DD = DateTime.Today;
            D.LADIEMCANHAN = false;
            db.DIADIEMs.Add(D);
            db.SaveChanges();

            HINHANH H = new HINHANH();
            H.ID_HA = Guid.NewGuid().ToString();
            H.ID_DD = D.ID_DD;
            H.LINK_HA = UploadImage(model.img);
            db.HINHANHs.Add(H);
            db.SaveChanges();

            success = true;
            return Json(new { success = success }, JsonRequestBehavior.AllowGet);
        }

        // Luu hinh anh
        public string UploadImage(HttpPostedFileWrapper img)
        {
            string path = "";
            path = Server.MapPath("/Content/Images/Point/") + img.FileName;
            img.SaveAs(path);
            path = "/Content/Images/Point/" + img.FileName;
            return path;
        }

        // Xem ban do cong dong

    }
}