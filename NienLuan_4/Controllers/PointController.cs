using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using NienLuan_4.Models;
using System.Device.Location;
using System.Text;

namespace NienLuan_4.Controllers
{
    public class PointController : Controller
    {
        Database_Entities db = new Database_Entities();
        // GET: Point       

        public ActionResult GetPointProp(string pointID)
        {
            DIADIEM D = db.DIADIEMs.Where(a => a.ID_DD == pointID).FirstOrDefault();
            var report = JsonConvert.SerializeObject(D, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public ActionResult ShowPrivatePoints()
        {
            string uID = User.Identity.Name;
            List<pointModel> P = new List<pointModel>();
            foreach(var item in db.DIADIEMs.Where(a => a.ID_TK == uID))
            {
                pointModel p = new pointModel();
                p.id = item.ID_DD;
                p.coor = item.TOADO_DD;
                p.loai = item.LOAIDIADIEM.ICON_LOAIDD;
                p.mota = item.MOTA_DD;
                P.Add(p);
            }
            var report = JsonConvert.SerializeObject(P, Formatting.None,
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
            D.DIACHI_DD = model.add;
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
            string guid = Guid.NewGuid().ToString();
            path = Server.MapPath("/Content/Images/Point/" + guid) + img.FileName;
            img.SaveAs(path);
            path = "/Content/Images/Point/" + guid + img.FileName;
            return path;
        }

        public JsonResult KiemTraDaThichDiaDiem(string id)
        {
            Boolean dathich = false;
            int luotthich;
            DIADIEMYEUTHICH D = db.DIADIEMYEUTHICHes.Where(a => a.ID_DD == id && a.ID_TK == User.Identity.Name).FirstOrDefault();
            DIADIEM dd = db.DIADIEMs.Where(a => a.ID_DD == id).FirstOrDefault();
            luotthich = dd.LUOTTHICH_DD.Value;
            if (D == null)
            {
                dathich = false;
            }
            else
            {
                dathich = true;                
            }
            return Json(new { success = dathich, luotthich = luotthich }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ThichDiaDiem(string id)
        {
            Boolean success = false;
            DIADIEMYEUTHICH D = db.DIADIEMYEUTHICHes.Where(a => a.ID_DD == id && a.ID_TK == User.Identity.Name).FirstOrDefault();
            if (D == null)
            {
                DIADIEMYEUTHICH d = new DIADIEMYEUTHICH();
                d.ID_DDYT = Guid.NewGuid().ToString();
                d.ID_DD = id;
                d.ID_TK = User.Identity.Name;
                d.NgayThich = DateTime.Today;
                db.DIADIEMYEUTHICHes.Add(d);
                db.SaveChanges();

                DIADIEM DD = db.DIADIEMs.Where(a => a.ID_DD == id).FirstOrDefault();
                db.Entry(DD).State = EntityState.Detached;
                DD.LUOTTHICH_DD += 1;
                db.Entry(DD).State = EntityState.Modified;
                db.SaveChanges();
            }
            else
            {
                db.DIADIEMYEUTHICHes.Remove(D);
                db.SaveChanges();


                DIADIEM DD = db.DIADIEMs.Where(a => a.ID_DD == id).FirstOrDefault();
                db.Entry(DD).State = EntityState.Detached;
                DD.LUOTTHICH_DD -= 1;
                db.Entry(DD).State = EntityState.Modified;
                db.SaveChanges();
            }
            return Json(new { success = success }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult DangBinhLuan(string dd, string cmt)
        {
            BINHLUAN B = new BINHLUAN();
            B.ID_BL = Guid.NewGuid().ToString();
            B.ID_TK = User.Identity.Name;
            B.ID_DD = dd;
            B.NOIDUNG_BL = cmt;
            B.LUOTTHICH_BL = 0;
            B.NGAY_BL = DateTime.Today;
            db.BINHLUANs.Add(B);
            db.SaveChanges();

            List<BINHLUAN> L = db.BINHLUANs.Where(a => a.ID_DD == dd).ToList();
            
            var report = JsonConvert.SerializeObject(L, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public JsonResult KiemTraDaThichBL(string id)
        {
            int luotthich = 0;
            BINHLUANDATHICH B = db.BINHLUANDATHICHes.Where(a => a.ID_BL == id && a.ID_TK == User.Identity.Name).FirstOrDefault();
            if(B == null)
            {
                return Json(new { liked = false, luotthich = luotthich }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                BINHLUAN b = db.BINHLUANs.Where(a => a.ID_BL == id).FirstOrDefault();
                luotthich = b.LUOTTHICH_BL.Value;
                return Json(new { liked = true, luotthich = luotthich }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult ThichBinhLuan(string id)
        {
            BINHLUANDATHICH B = db.BINHLUANDATHICHes.Where(a => a.ID_BL == id && a.ID_TK == User.Identity.Name).FirstOrDefault();
            if(B == null)
            {
                BINHLUANDATHICH b = new BINHLUANDATHICH();
                b.ID_BL = id;
                b.ID_BLYT = Guid.NewGuid().ToString();
                b.ID_TK = User.Identity.Name;
                b.NgayThich = DateTime.Today;
                db.BINHLUANDATHICHes.Add(b);
                db.SaveChanges();

                BINHLUAN bl = db.BINHLUANs.Where(a => a.ID_BL == id).FirstOrDefault();
                db.Entry(bl).State = EntityState.Detached;
                bl.LUOTTHICH_BL += 1;
                db.Entry(bl).State = EntityState.Modified;
                db.SaveChanges();
            }
            else
            {
                db.BINHLUANDATHICHes.Remove(B);
                db.SaveChanges();

                BINHLUAN bl = db.BINHLUANs.Where(a => a.ID_BL == id).FirstOrDefault();
                db.Entry(bl).State = EntityState.Detached;
                bl.LUOTTHICH_BL -= 1;
                db.Entry(bl).State = EntityState.Modified;
                db.SaveChanges();
            }
            return Json(new { s = true }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ChinhSuaDiaDiem(EditPointModel model)
        {
            DIADIEM D = db.DIADIEMs.Where(a => a.ID_DD == model.id).FirstOrDefault();
            db.Entry(D).State = EntityState.Detached;
            if(D.TEN_DD != model.name) D.TEN_DD = model.name;
            if (D.DIACHI_DD != model.add) D.DIACHI_DD = model.add;
            HINHANH H = db.HINHANHs.Where(a => a.ID_DD == model.id).FirstOrDefault();
            string link = H.LINK_HA;
            if (model.img != null)
            {
                var path = Server.MapPath(link);
                System.IO.File.Delete(path);
               
                db.Entry(H).State = EntityState.Detached;
                H.LINK_HA = UploadImage(model.img);
                db.Entry(H).State = EntityState.Modified;
                db.SaveChanges();
            }
            int l = 0; int.TryParse(model.loai, out l);
            if (D.ID_LOAIDD != l) D.ID_LOAIDD = l;
            if (D.MOTA_DD != model.mota) D.MOTA_DD = model.mota;

            db.Entry(D).State = EntityState.Modified;
            db.SaveChanges();
            DIADIEM DD = db.DIADIEMs.Where(a => a.ID_DD == model.id).FirstOrDefault();

            var report = JsonConvert.SerializeObject(DD, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public JsonResult XoaDiaDiem(string id)
        {
            var s = "success";
            DIADIEM D = db.DIADIEMs.Where(a => a.ID_DD == id).FirstOrDefault();
            try
            {
                List<BINHLUAN> B = db.BINHLUANs.Where(a => a.ID_DD == id).ToList();
                if(B != null)
                {
                    // xoa binh luan yeu thich
                    foreach (var item in B)
                    {
                        BINHLUANDATHICH b = db.BINHLUANDATHICHes.Where(a => a.ID_BL == item.ID_BL).FirstOrDefault();
                        if(b != null)
                        {
                            db.BINHLUANDATHICHes.Remove(b);
                            db.SaveChanges();
                        }                       
                    }
                    // xoa binh luan
                    foreach (var item in B)
                    {
                        db.BINHLUANs.Remove(item);
                        db.SaveChanges();
                    }
                }

                List<DIADIEMYEUTHICH> d = db.DIADIEMYEUTHICHes.Where(a => a.ID_DD == id).ToList();
                // xoa dia diem yeu thich
                foreach(var item in d)
                {
                    db.DIADIEMYEUTHICHes.Remove(item);
                    db.SaveChanges();
                }

                // xoa hinh anh
                HINHANH H = db.HINHANHs.Where(a => a.ID_DD == id).FirstOrDefault();
                System.IO.File.Delete(Server.MapPath(H.LINK_HA));
                db.HINHANHs.Remove(H);

                // xoa dia diem
                db.DIADIEMs.Remove(D);
                db.SaveChanges();

            }
            catch(Exception e)
            {
                s = e.ToString();
            }
            return Json(new { s = s }, JsonRequestBehavior.AllowGet);
        }

        public double Khoang_cach(string p1, string p2)
        {
            double lat1, lat2, lng1, lng2;
            double.TryParse(p1.Split(',')[0], out lat1);
            double.TryParse(p1.Split(',')[1], out lng1);
            double.TryParse(p2.Split(',')[0], out lat2);
            double.TryParse(p2.Split(',')[1], out lng2);
            var sCoord = new GeoCoordinate(lat1, lng1);
            var eCoord = new GeoCoordinate(lat2, lng2);
            double r = sCoord.GetDistanceTo(eCoord);
            return r;
        }

        public ActionResult HienDiaDiemCongDong(string coor)
        {           
            List<DIADIEM> D1 = db.DIADIEMs.Where(a => a.LADIEMCANHAN == false).ToList();
            List<pointModel> D2 = new List<pointModel>();
            foreach(var item in D1)
            {
                if(Khoang_cach(coor, item.TOADO_DD) <= 5000)
                {
                    pointModel p = new pointModel();
                    p.id = item.ID_DD;
                    p.coor = item.TOADO_DD;
                    p.mota = item.MOTA_DD;
                    p.loai = item.LOAIDIADIEM.ICON_LOAIDD;
                    D2.Add(p);
                }
            }
            var report = JsonConvert.SerializeObject(D2, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public ActionResult TimKiemDiaDiem(string coor, string dis, string loai)
        {
            double k; double.TryParse(dis, out k); k *= 1000;
            int maloai = 0;
            List<pointModel> P = new List<pointModel>();
            var L = db.DIADIEMs.Where(a => a.LADIEMCANHAN == false).ToList();

            if(!int.TryParse(loai, out maloai))
            {               
                foreach (var item in L)
                {
                    if (Khoang_cach(coor, item.TOADO_DD) <= k)
                    {
                        pointModel p = new pointModel();
                        p.id = item.ID_DD;
                        p.coor = item.TOADO_DD;
                        p.mota = item.MOTA_DD;
                        p.loai = item.LOAIDIADIEM.ICON_LOAIDD;
                        P.Add(p);
                    }
                }
            }
            else
            {
                foreach (var item in L)
                {
                    if (Khoang_cach(coor, item.TOADO_DD) <= k && item.ID_LOAIDD == maloai)
                    {
                        pointModel p = new pointModel();
                        p.id = item.ID_DD;
                        p.coor = item.TOADO_DD;
                        p.mota = item.MOTA_DD;
                        p.loai = item.LOAIDIADIEM.ICON_LOAIDD;
                        P.Add(p);
                    }
                }
            }            

            var report = JsonConvert.SerializeObject(P, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public ActionResult TimKiemTheoTen(string str)
        {
            List<pointModel> P = new List<pointModel>();

            foreach (var i in db.DIADIEMs)
            {
                if(i.TEN_DD.Contains(str) || i.DIACHI_DD.Contains(str) || i.MOTA_DD.Contains(str) ||
                    i.TEN_DD.Contains(str.ToLower()) || i.DIACHI_DD.Contains(str.ToLower()) || i.MOTA_DD.Contains(str.ToLower()) ||
                    i.TEN_DD.Contains(str.ToUpper()) || i.DIACHI_DD.Contains(str.ToUpper()) || i.MOTA_DD.Contains(str.ToLower()))
                {
                    pointModel p = new pointModel();
                    p.id = i.ID_DD;
                    p.coor = i.TOADO_DD;
                    p.mota = i.MOTA_DD;
                    p.loai = i.LOAIDIADIEM.ICON_LOAIDD;
                    P.Add(p);
                }
            }

            var report = JsonConvert.SerializeObject(P, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public ActionResult LayLuotThich(string id)
        {
            DIADIEM D = db.DIADIEMs.Where(a => a.ID_DD == id).FirstOrDefault();
            var report = JsonConvert.SerializeObject(D.LUOTTHICH_DD, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }

        public ActionResult LayLuotThichBinhLuan(string id)
        {
            BINHLUAN B = db.BINHLUANs.Where(a => a.ID_BL == id).FirstOrDefault();
            var report = JsonConvert.SerializeObject(B.LUOTTHICH_BL, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(report, "application/json");
        }
    }
}