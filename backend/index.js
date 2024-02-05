const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');


const app = express();
const PORT = 5500;




app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));


const datas = {
    "name": "Ravi Kumar",
    "roll": "1346"
}

app.get("/", (req, res) => {
    console.log(`App is Initialized`);
    return res.status(200).json({
        success: true,
        message: 'This is the default API',
        data: datas
    })
})


// converting the file size in gb or mb
const convertFileSize = (sizeInBytes) => {
    const kilobyte = 1024;
    const megabyte = kilobyte * 1024;
    const gigabyte = megabyte * 1024;
    if (sizeInBytes >= gigabyte) {
        return (sizeInBytes / gigabyte).toFixed(2) + ' GB';
    } else if (sizeInBytes >= megabyte) {
        return (sizeInBytes / megabyte).toFixed(2) + ' MB';
    } else if (sizeInBytes >= kilobyte) {
        return (sizeInBytes / kilobyte).toFixed(2) + ' KB';
    } else {
        return sizeInBytes + ' bytes';
    }
}

//formatting the date
const formatDate = (date) => {
    const day = String(new Date(date).getDate()).padStart(2, '0');
    const month = String(new Date(date).getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = new Date(date).getFullYear();

    return `${day}-${month}-${year}`;
}


app.post("/uploadFiles", async (req, res) => {

    try {


        let sendDetails = [];
        let fileDetails = {
            id: 0,
            name: '',
            extension: '',
            size: '',
            lastModifiedDate: '',
            createDate: '',
            filePath: ''
        };


        //check if files are present in the request
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400)
                .json({
                    success: false,
                    message: 'No files uploaded',
                });
        };

        //Accessing files filenames, and fileUrl form FormData
        const files = req.files['files[]'];
        // const fileNames = req.body['fileName[]'];
        const fileUrls = req.body['fileUrl[]'];


        for (let i = 0; i < files.length - 1; i++) {

            const file = files[i];
            const url = fileUrls[i];
            // console.log(`this is the file : ${file}`)
            // console.log(`this is the url : ${url}`)

            
            let fileName = file.name;
            let fileExt = path.extname(file.name);
            let fileSize = convertFileSize(file.size);



            let pathurl = url.split('/');
            // console.log(`this is the pathurl : ${pathurl}`);
            let len = pathurl.length;
            let filteredurl = pathurl.filter((path, i) => i !== len - 1);
            // console.log(`this is the filteredurl : ${filteredurl} and type Of it is ${Array.isArray(filteredurl)}`)
            let joinurl = filteredurl.join('/');
            let bpath = path.join(__dirname, joinurl);
            // console.log(`this is the basepath : ${basePath}`)
            let replacedPath = bpath.replaceAll('\\', '/').split('/');
            // console.log(`this is the replacedPath : ${replacedPath}`)
            let filteredPath = replacedPath.filter((path) => path !== 'folderUpload' && path !== 'backend');
            let basePath = filteredPath.join('/');
            let newStr = path.join(basePath, `/${file.name}`);

           



            const stats = fs.statSync(newStr);
            let cd = stats.birthtime;
            let lmd = stats.mtime;
            const createdDate = formatDate(cd);
            const modifiedDate = formatDate(lmd);
            let createDate = createdDate;
            let lastModifiedDate = modifiedDate;
            let filePath = url;



            sendDetails.push({
                name:fileName,
                ext: fileExt,
                size: fileSize,
                createdDate: createDate,
                modifiedDate: lastModifiedDate,
                url: filePath
            });
        }


        //getting the file
        // files.forEach((file, index) => {
        //     //Save the file to a specific directory
        //     // const uploadPath = path.join(__dirname, 'uploads', file.name);
        //     fileDetails.id += 1; 
        //     fileDetails.name = file.name;
        //     fileDetails.extension = path.extname(file.name);
        //     fileDetails.size = convertFileSize(file.size);

        //     sendDetails.push(fileDetails);
        // });
        // console.log(sendDetails)

        //getting the every files url
        // fileUrls.forEach((url, index) => {


        //     let pathurl = url.split('/');
        //     let len = pathurl.length;
        //     let filteredurl = pathurl.filter((path, i) => i !== len - 1);
        //     let bapath = path.join(__dirname, filteredurl);
        //     let replacedPath = bapath.replaceAll('\\', '/').split('/');
        //     let filteredPath = replacedPath.filter((path) => path !== 'folderUpload' && path !== 'backend');
        //     let basePath = filteredPath.join('/');


        //     let newStr = path.join(basePath, `/${fileName}`)

        //     const stats = fs.statSync(newStr);
        //     let cd = stats.birthtime;
        //     let lmd = stats.mtime;
        //     const createdDate = formatDate(cd);
        //     const modifiedDate = formatDate(lmd);

        //     // let fileUrlPath = path.join(urlPath, `/${fileName}`);
        //     // let repfileurlpath = fileUrlPath.replace('\\', '/');


        //     fileDetails.createDate = createdDate;
        //     fileDetails.lastModifiedDate = modifiedDate;
        //     fileDetails.filePath = pathurl;


        // })

        // console.log(fileDetails)
        // sendDetails.push(fileDetails);


        //This is the code if you want to upload the file inside the backend/uploads folder
        // file.mv(uploadPath, err => {
        //     if (err) {
        //         console.error(err);
        //         return res.status(500).json({
        //             success: false,
        //             message: 'Error occured while uploading files'
        //         })
        //     }
        //     console.log(`File ${fileNames[index]} uploaded successfully.`)
        // })

        return res.status(200).json({
            success: true,
            message: 'Files Uploaded Successfully',
            data: sendDetails
        });

    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message
            });
    };
})







app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})