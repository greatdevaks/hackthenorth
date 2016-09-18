
window.onload = function() 
{
  var currentPage = window.location.href;
  var reqURL, reqURLs;
      console.log("Level 1");
      if(currentPage.indexOf("watch") > -1)
      {
        console.log("Level 2");
        //console.log("URL" + window.location.href);
        var ad = currentPage.slice(currentPage.indexOf("?v=") + 3, currentPage.length);
        reqURL = "https://video.google.com/timedtext?lang=en&v=" + ad;
        console.log("Level 3");
        $.post(reqURL, function(data)
        {
          console.log("Level 4");
          function xmlToJson(xml) 
          {
            var obj = {};
            if (xml.nodeType == 1) 
            { 
              if (xml.attributes.length > 0) 
              {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) 
                {
                  var attribute = xml.attributes.item(j);
                  obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
              }
            } 
            else if (xml.nodeType == 3) 
            { 
              obj = xml.nodeValue;
            }
            if (xml.hasChildNodes()) 
            {
              for(var i = 0; i < xml.childNodes.length; i++) 
              {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") 
                {
                  obj[nodeName] = xmlToJson(item);
                } 
                else 
                {
                  if (typeof(obj[nodeName].push) == "undefined") 
                  {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                  }
                  obj[nodeName].push(xmlToJson(item));
                }
              }
            }
            return obj;
          };
          var jsonText = JSON.stringify(xmlToJson(data));
          //console.log(jsonText);
          var jsonData = JSON.parse(jsonText);
          console.log("Level 5");
          //console.log(jsonData);
          //console.log(jsonData.transcript.text);
          var a = jsonData.transcript.text;
          var counter = "";
          for (var i = 0; i < a.length; i++) {
              counter = counter + " " + a[i]["#text"];
          }
          var chra = counter.replace(/[^a-zA-Z ]/g, "")
          var res = encodeURI(chra);
          console.log(chra);
          reqURLs = "https://api.havenondemand.com/1/api/sync/analyzesentiment/v1?text=" + res + "&apikey=54b8402b-3364-4261-8c35-0bf0bdcc7d81";
          //console.log("Level 3");
          $.post(reqURLs, function(dataz)
          {
            if(dataz.aggregate.sentiment == "negative")
            {
              console.log("Wrong");
              window.open("https://www.youtube.com/","_self");
              document.body.style.backgroundColor = "red";
              document.body.style.color = "white";
              document.body.innerHTML= "<h1>BLOCKED</h1>";
              alert("VIDEO BLOCKED.\nEnjoy safe content.\nSentiment: " + dataz.aggregate.sentiment + "\nScore: " +dataz.aggregate.score);
            }
            else
            {
              console.log("Right");
              alert("Sentiment: " + dataz.aggregate.sentiment + "\nScore: " +dataz.aggregate.score);
            }
          });

          currentPage = "";
        });
      }
};
