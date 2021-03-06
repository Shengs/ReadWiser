'use strict';

var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

module.exports = function (router) {
    router.get('/', function (req, res) {         
        res.render('manage/index');                
    });

    router.get('/books', function (req, res) {
    	Book.find({}, function(err, books){
    		if(err) {
    			console.log(err);
    		}
    		var model = {
    			books:books
    		};

    		res.render('manage/books/index', model); 
    	})                        
    });

    router.get('/categories', function (req, res) {
    	Category.find({}, function(err, categories){
    		if(err) {
    			console.log(err);
    		}
    		var model = {
    			categories:categories
    		};

    		res.render('manage/categories/index', model); 
    	})                        
    });

    // Setup adding new book form

    router.get('/books/add', function(req, res){
    	Category.find({}, function(err, categories){
    		if(err) {
    			console.log(err);
    		}
    		var model = {
    			categories: categories
    		};

    		res.render('manage/books/add', model);
    	})
    });

    // Add a new book

    router.post('/books', function(req, res){
    	var title = req.body.title.trim();
        var category = req.body.category.trim();
        var author = req.body.author.trim();
        var publisher = req.body.publisher.trim();
        var price = req.body.price.trim();
        var description = req.body.description.trim();
        var cover = req.body.cover;

    
        // Decimal Limits
        price = Number(price).toFixed(2);

        // create new book using schema

    	var newBook = new Book({
    		title:title,
    		category:category,
    		description:description,
    		price:price,
    		author:author,
    		publisher:publisher,
    		cover:cover
    	});

    	newBook.save(function(err){
    		if(err) {
    			console.log('save error', err)
    		}

    		req.flash('success', "Book Added");
    		res.redirect('/manage/books');
    	})
    });

    // Display Edit form

    router.get('/books/edit/:id', function (req, res) {
    	Category.find({}, function (err, categories) {
    		Book.findOne({_id:req.params.id}, function (err, book) {
    			if (err) {
    				console.log(err)
    			}

    			var model = {
    				book: book,
    				categories: categories
    			};

    			res.render('manage/books/edit', model)
    		})
    	})
    });

    // Edit Book Info

    router.post('/books/edit/:id', function (req, res) {
    	var title = req.body.title.trim();
        var category = req.body.category.trim();
        var author = req.body.author.trim();
        var publisher = req.body.publisher.trim();
        var price = req.body.price.trim();
        var description = req.body.description.trim();
        var cover = req.body.cover;

        // Decimal Limits
        price = parseFloat(price).toFixed(2);

    	// Update Book Info
    	Book.update({_id:req.params.id}, {
    		title: title,
    		category: category,
    		author: author,
    		publisher: publisher,
    		price: price,
    		description: description,
    		cover: cover
    	}, function(err) {
    		if(err) {
    			console.log('Update failure', err)
    		}

    		req.flash('success', "Book Updated");
    		res.redirect('/manage/books')
    	})
    });

    // Delete Book
    router.delete('/books/delete/:id', function (req, res) {
        Book.remove({_id: req.params.id}, function (err) {
            if (err) {
                console.log(err);
            }

            req.flash('success', "Book Deleted");
            res.redirect('/manage/books');
        });
    });


    //Display category add form
    router.get('/categories/add', function (req, res) {
    	res.render('manage/categories/add')
    });

    // Add a new category
    router.post('/categories', function(req, res){
        var name= req.body.name.trim();

        var newCategory = new Category({
            name:name
        });

        newCategory.save(function(err) {
            if(err) {
                console.log('save error', err);
            }

            req.flash('success', "Category Added");
            res.redirect('/manage/categories');
        });   

    });

    // Display category edit form
    router.get('/categories/edit/:id', function (req, res) {
         Category.findOne({_id:req.params.id},function (err, category) {
            if (err) {
                console.log(err);
            }
            var model ={
                category: category
            };
            res.render('manage/categories/edit', model);
        });
    });

    // Edit category
    router.post('/categories/edit/:id', function(req, res){
        var name= req.body.name && req.body.name.trim();

        Category.update({_id: req.params.id}, {
            name:name
        }, function(err) {
            if(err) {
                console.log('update error', err);
            }

            req.flash('success', "Category Updated");
            res.redirect('/manage/categories');
        });

    });

    // Delete category
    router.delete('/categories/delete/:id', function (req, res) {
        Category.remove({_id: req.params.id}, function (err) {
            if (err) {
                console.log(err);
            }

            req.flash('success', "Category Deleted");
            res.redirect('/manage/categories');
        });
    });
};
