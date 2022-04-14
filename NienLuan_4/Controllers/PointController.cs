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
    }
}