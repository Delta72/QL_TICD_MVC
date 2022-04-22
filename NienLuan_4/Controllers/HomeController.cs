using Newtonsoft.Json;
using NienLuan_4.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NienLuan_4.Controllers
{
    public class HomeController : Controller
    {
        Database_Entities db = new Database_Entities();
        public ActionResult Index()
        {
            return View();
        }

        public string Ve(string f)
        {
            string ve = System.IO.File.ReadAllText(Server.MapPath(f));
            return ve;
        }

        public ActionResult Ve_Can_Tho()
        {
            string str1 = Ve("~/Content/Geojson/CanTho.geojson");
            var r = JsonConvert.SerializeObject(str1, Formatting.None,
                         new JsonSerializerSettings()
                         {
                             ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                         });
            return Content(r, "application/json");
        }

        public ActionResult Ve_QH()
        {
            List<PolyModel> P = new List<PolyModel>();
            foreach(var a in db.QUANHUYENs)
            {
                PolyModel p = new PolyModel();
                p.id = a.ID_Q;
                string re = new string(a.TEN_Q.Where(c => char.IsLetterOrDigit(c) || (c >= ' ' && c <= byte.MaxValue)).ToArray());
                p.name = re;
                p.poly = Ve(a.POLYGON_Q);
                P.Add(p);
            }
            var r = JsonConvert.SerializeObject(P, Formatting.None,
                         new JsonSerializerSettings()
                         {
                             ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                         });
            return Content(r, "application/json");
        }

        public ActionResult Ve_PX(string data)
        {
            List<PHUONGXA> PX = db.PHUONGXAs.Where(a => a.QUANHUYEN.TEN_Q == data).ToList();
            List<PolyModel> P = new List<PolyModel>();
            foreach(var a in PX)
            {
                PolyModel p = new PolyModel();
                p.id = a.ID_PX;
                p.name = a.TEN_PX;
                p.poly = Ve(a.POLYGON_PX);
                P.Add(p);
            }
            var r = JsonConvert.SerializeObject(P, Formatting.None,
                         new JsonSerializerSettings()
                         {
                             ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                         });
            return Content(r, "application/json");
        }

        public ActionResult VeTatCaPX()
        {
            List<PHUONGXA> PX = db.PHUONGXAs.ToList();
            List<PolyModel> P = new List<PolyModel>();
            foreach (var a in PX)
            {
                PolyModel p = new PolyModel();
                p.id = a.ID_PX;
                p.name = a.TEN_PX;
                p.poly = Ve(a.POLYGON_PX);
                P.Add(p);
            }
            var r = JsonConvert.SerializeObject(P, Formatting.None,
                         new JsonSerializerSettings()
                         {
                             ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                         });
            return Content(r, "application/json");
        }

        public ActionResult About()
        {
            return View();
        }
    }
}