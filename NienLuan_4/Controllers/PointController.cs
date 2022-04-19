using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using NienLuan_4.Models;

namespace NienLuan_4.Controllers
{
    public class PointController : Controller
    {
        QL_TICD_Entities db = new QL_TICD_Entities();
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
    }
}