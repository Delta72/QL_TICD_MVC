using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using NienLuan_4.Models;

namespace NienLuan_4.Controllers
{
    public class PointController : Controller
    {
        Database_Entities db = new Database_Entities();
        // GET: Point
        public ActionResult ShowAllPoints()
        {
            List<pointModel> listModel = new List<pointModel>();
            foreach(var item in db.DIADIEMs)
            {
                if(item.LADIEMCANHAN == false)
                {
                    pointModel p = new pointModel();
                    p.id = item.ID_DD;
                    p.coor = item.TOADO_DD;
                    p.loai = item.ID_LOAIDD;
                    listModel.Add(p);
                }
            }
            var r = JsonConvert.SerializeObject(listModel, Formatting.None,
                                     new JsonSerializerSettings()
                                     {
                                         ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                                     });
            return Content(r, "application/json");
        }

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
                p.loai = item.ID_LOAIDD;
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

        public JsonResult DangBinhLuan(string dd, string cmt)
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
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }
    }
}