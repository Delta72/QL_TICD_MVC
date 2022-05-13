using Newtonsoft.Json;
using NienLuan_4.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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
            List<loaiModel> l = new List<loaiModel>();
            foreach(var i in L)
            {
                loaiModel lo = new loaiModel();
                lo.id = i.ID_LOAIDD;
                lo.loai = i.TEN_LOAIDD;
                l.Add(lo);
            }
            var report = JsonConvert.SerializeObject(l, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public ActionResult LayThongTin()
        {
            string id = User.Identity.Name;
            TAIKHOAN TK = db.TAIKHOANs.Where(a => a.ID_TK == id).First();
            UserManagerModel m = new UserManagerModel();
            m.id = TK.ID_TK;
            m.name = TK.TAIKHOAN_TK;
            m.displayname = TK.TENHIENTHI_TK;
            m.img = db.HINHANHs.Where(a => a.ID_TK == id).Select(a => a.LINK_HA).First();
            m.pass = TK.MATKHAU_TK;
            m.email = TK.EMAIL_TK;
            m.phone = TK.SDT_TK;

            var report = JsonConvert.SerializeObject(m, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }


        public ActionResult KiemTraMatKhau(string mk)
        {
            Boolean isValid = false;
            if(db.TAIKHOANs.Where(a => a.ID_TK == User.Identity.Name).Select(a => a.MATKHAU_TK).FirstOrDefault() == mk)
            {
                isValid = true;
            }
            var report = JsonConvert.SerializeObject(isValid, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public ActionResult DoiMatKhau(string mk)
        {
            TAIKHOAN T = db.TAIKHOANs.Where(a => a.ID_TK == User.Identity.Name).First();
            db.Entry(T).State = EntityState.Detached;
            T.MATKHAU_TK = mk;
            db.Entry(T).State = EntityState.Modified;
            db.SaveChanges();

            var report = JsonConvert.SerializeObject(true, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public ActionResult LuuThongTin(string tentk, string tenht, string email, string sdt)
        {
            TAIKHOAN T = db.TAIKHOANs.Where(a => a.ID_TK == User.Identity.Name).First();
            db.Entry(T).State = EntityState.Detached;

            T.TAIKHOAN_TK = tentk;
            T.TENHIENTHI_TK = tenht;
            T.EMAIL_TK = email;
            T.SDT_TK = sdt;

            db.Entry(T).State = EntityState.Modified;
            db.SaveChanges();

            var report = JsonConvert.SerializeObject(true, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public ActionResult DanhSachTaiKhoan(string s)
        {
            List<UserManagerModel> M = new List<UserManagerModel>();

            foreach(var t in db.TAIKHOANs.Where(a => a.ID_LOAITK != 3 && (a.TAIKHOAN_TK.Contains(s) || 
                a.TENHIENTHI_TK.Contains(s) || a.EMAIL_TK.Contains(s) || a.SDT_TK.Contains(s))).ToList())
            {
                UserManagerModel m = new UserManagerModel();
                m.id = t.ID_TK;
                m.name = t.TAIKHOAN_TK;
                m.displayname = t.TENHIENTHI_TK;
                m.email = t.EMAIL_TK;
                m.phone = t.SDT_TK;
                string l = db.HINHANHs.Where(a => a.ID_TK == t.ID_TK).Select(a => a.LINK_HA).FirstOrDefault();
                if(l != null)
                {
                    m.img = l;
                }
                else
                {
                    m.img = "/Content/Images/UserProfile/AnoAvatar.png";
                }
                M.Add(m);
            }

            var report = JsonConvert.SerializeObject(M, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public JsonResult KiemTraDaKhoa(string id)
        {
            Boolean dakhoa = false;
            TAIKHOAN T = db.TAIKHOANs.Where(a => a.ID_TK == id).First();
            if(T.DAKHOA_TK == true)
            {
                dakhoa = true;
            }
            return Json(dakhoa, JsonRequestBehavior.AllowGet);
        }

        public JsonResult KhoaTaiKhoan(string id)
        {
            TAIKHOAN T = db.TAIKHOANs.Where(a => a.ID_TK == id).First();
            db.Entry(T).State = EntityState.Detached;
            if (T.DAKHOA_TK == true)
            {
                T.DAKHOA_TK = false;
            }
            else
            {
                T.DAKHOA_TK = true;
            }
            db.Entry(T).State = EntityState.Modified;
            db.SaveChanges();
            return Json(T.DAKHOA_TK, JsonRequestBehavior.AllowGet);
        }

        public JsonResult KhoaKhongHoatDong(string time)
        {
            int ngay; int.TryParse(time, out ngay);
            ngay *= 30;
            DateTime d = DateTime.Today;

            foreach (var i in db.TAIKHOANs)
            {
                DateTime dc = (DateTime)i.LANHDCUOI_TK;
                int n = (d - dc).Days;
                if(n >= ngay)
                {
                    db.Entry(i).State = EntityState.Detached;
                    i.DAKHOA_TK = true;
                    db.Entry(i).State = EntityState.Modified;
                    
                }
            }
            db.SaveChanges();
            return Json(ngay, JsonRequestBehavior.AllowGet);
        }

        public ActionResult DSTKTK(string date1, string date2, string select)
        {
            List<UserManagerModel> M = new List<UserManagerModel>();
            DateTime d1 = DateTime.Now; 
            DateTime d2 = DateTime.Now;
            if (date1 != "")
            {
                d1 = DateTime.Parse(date1);
            }
            if(date2 != "")
            {
                d2 = DateTime.Parse(date2);
            }

            if(date1 == "" && date2 != "")
            {
                foreach(var i in db.TAIKHOANs)
                {
                    if(DateTime.Compare((DateTime)i.NGAYTAO_TK, d2) < 0)
                    {
                        UserManagerModel m = new UserManagerModel();
                        m.name = i.TAIKHOAN_TK;
                        m.displayname = i.TENHIENTHI_TK;
                        m.luotthich = (from x in db.DIADIEMYEUTHICHes where x.ID_TK == i.ID_TK select x).Count();
                        m.luotbl = (from x in db.BINHLUANs where x.ID_TK == i.ID_TK select x).Count();
                        M.Add(m);
                    }
                }
            }
            if(date1 != "" && date2 == "")
            {
                foreach (var i in db.TAIKHOANs)
                {
                    if (DateTime.Compare((DateTime)i.NGAYTAO_TK, d1) > 0)
                    {
                        UserManagerModel m = new UserManagerModel();
                        m.name = i.TAIKHOAN_TK;
                        m.displayname = i.TENHIENTHI_TK;
                        m.luotthich = (from x in db.DIADIEMYEUTHICHes where x.ID_TK == i.ID_TK select x).Count();
                        m.luotbl = (from x in db.BINHLUANs where x.ID_TK == i.ID_TK select x).Count();
                        M.Add(m);
                    }
                }
            }
            if (date1 != "" && date2 != "")
            {
                foreach (var i in db.TAIKHOANs)
                {
                    if (DateTime.Compare((DateTime)i.NGAYTAO_TK, d1) > 0 && DateTime.Compare((DateTime)i.NGAYTAO_TK, d2) < 0)
                    {
                        UserManagerModel m = new UserManagerModel();
                        m.name = i.TAIKHOAN_TK;
                        m.displayname = i.TENHIENTHI_TK;
                        m.luotthich = (from x in db.DIADIEMYEUTHICHes where x.ID_TK == i.ID_TK select x).Count();
                        m.luotbl = (from x in db.BINHLUANs where x.ID_TK == i.ID_TK select x).Count();
                        M.Add(m);
                    }
                }
            }
            if(date1 == "" && date2 == "")
            {
                foreach (var i in db.TAIKHOANs)
                {
                        UserManagerModel m = new UserManagerModel();
                        m.name = i.TAIKHOAN_TK;
                        m.displayname = i.TENHIENTHI_TK;
                        m.luotthich = (from x in db.DIADIEMYEUTHICHes where x.ID_TK == i.ID_TK select x).Count();
                        m.luotbl = (from x in db.BINHLUANs where x.ID_TK == i.ID_TK select x).Count();
                        M.Add(m);
                }
            }

            List<UserManagerModel> r = new List<UserManagerModel>();
            if(select == "bl")
            {
                foreach(var i in M.OrderByDescending(a => a.luotbl))
                {
                    if(i.name != "ccc")
                    {
                        r.Add(i);
                    }
                }                
            }
            else if(select == "lt")
            {
                foreach (var i in M.OrderByDescending(a => a.luotthich))
                {
                    if (i.name != "ccc")
                    {
                        r.Add(i);
                    }
                }
            }
            else
            {
                foreach (var i in M)
                {
                    if (i.name != "ccc")
                    {
                        r.Add(i);
                    }
                }
            }


            var report = JsonConvert.SerializeObject(r, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }
    }
}