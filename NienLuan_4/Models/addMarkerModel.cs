using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NienLuan_4.Models
{
    public class addMarkerModel
    {
        public string imgLink { get; set; }
        public HttpPostedFileWrapper img { get; set; }
        public string name { get; set; }
        public string loai { get; set; }
        public string coor { get; set; }       
        public string mota { get; set; }

        public string idpx { get; set; }
    }
}