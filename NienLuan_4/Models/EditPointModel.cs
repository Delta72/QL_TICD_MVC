using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NienLuan_4.Models
{
    public class EditPointModel
    {
        public HttpPostedFileWrapper img { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string add { get; set; }
        public string loai { get; set; }
        public string mota { get; set; }
    }
}