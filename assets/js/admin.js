$(document).ready(function() {
	$.ajax({
		url: '/api/books/',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
		$('#books').empty();
		for(var i in data) {
			var html = '<tr id="' + data[i]._id + '"><td>' + data[i].author + '</td>';
			html += '<td>' + data[i].title + '</td>';
			html += '<td>' + data[i].price + '</td>';
			html += '<td class="center"><button data-toggle="modal" data-target="#bookmodal" onclick="edit(\'' + data[i]._id + '\')" class="btn btn-xs">Edit</button>&nbsp;<button onclick="del(\'' + data[i]._id + '\')" class="btn btn-xs">Delete</button></td></tr>';
			$('#books').append(html);
		}
	});
});

function add() {
	var author = $('#author').val();
	var title = $('#title').val();
	var picture = $('#picture').val();
	var description = $('#description').val();
	var downloadLink = $('#downloadLink').val();
	var price = $('#price').val();
	$.ajax({
		url: '/api/books',
		type: 'POST',
		data: {
			author : author,
			title : title,
			picture : picture,
			description : description,
			downloadLink : downloadLink,
			price : price,
			views  : 0
		},
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
		if(data.errCode) {
			$('#author').text('ERROR');
			$('#title').text('ERROR');
			$('#picture').text('ERROR');
			$('#description').text('ERROR');
			$('#price').text('ERROR');
			return;
		}
		var html = '<tr id="' + data.id + '"><td>' + author + '</td>';
		html += '<td>' + title + '</td>';
		html += '<td>' + price + '</td>';
		html += '<td class="center"><button data-toggle="modal" data-target="#bookmodal" onclick="edit(\'' + data.id + '\')" class="btn btn-xs">Edit</button>&nbsp;<button onclick="del(\'' + data.id + '\')" class="btn btn-xs">Delete</button></td></tr>';
		$('#books').append(html);
	});
}

function edit(item) {
	setModalAction('edit');
	$.ajax({
		url: '/api/books/' + item,
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
		if(data[0].errCode) {
			$('#author').text('ERROR');
			$('#title').text('ERROR');
			return;
		}
		$('#author').val(data[0].author);
		$('#title').val(data[0].title);
		$('#bookid').val(data[0]._id);
		$('#picture').val(data[0].picture);
		$('#description').val(data[0].description);
		$('#downloadLink').val(data[0].downloadLink);
		$('#price').val(data[0].price);
		$('#views').html(data[0].views);
	});
}

function editProc() {
	var id = $('#bookid').val();
	var author = $('#author').val();
	var title = $('#title').val();
	var picture = $('#picture').val();
	var description = $('#description').val();
	var downloadLink = $('#downloadLink').val();
	var price = $('#price').val();
	$.ajax({
		url: '/api/books/' + id,
		type: 'PUT',
		contentType: 'application/json',
		data: {
			author : author,
			title : title,
			picture : picture,
			description : description,
			price : price
		},
		dataType: 'json'
	})
	.done(function(data) {
		$('#' + id).children().each(function(d) {
			if(d === 0) {
				$(this).text(author);
			}
			else if(d === 1) {
				$(this).text(title);
			}
			else if(d === 2) {
				$(this).text(price);
			}
		})
	});
}

function del(item) {
	$.ajax({
		url: '/api/books/' + item,
		type: 'DELETE',
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
		if(data.resCode === 200) {
			$('#' + item).hide(500, function() {
				$('#' + item).remove();
			});
		}
	});
}

function setModalAction(action) {
	$("#editButton").hide();
	$("#addButton").hide();
	if(action === 'add') {
		$('#bookActionTitle').html('Add Book');
		$("#addButton").show();
	}
	else if(action === 'edit') {
		$('#bookActionTitle').html('Edit Book');
		$("#editButton").show();
	}
	$('#author').val('');
	$('#title').val('');
	$('#bookid').val('');
	$('#picture').val('');
	$('#description').val('');
	$('#downloadLink').val('');
	$('#price').val('');
	$('#views').html('');
}

$('#loginform').submit(function(e) {
	e.preventDefault();
	$.ajax({
        url : '/api/users?type=login',
        type: "POST",
        data : {
        	username: $('#username').val(),
        	password: $('#password').val()
        },
        success:function(data, textStatus, jqXHR) 
        {
            if(data.errCode) {
            	$('#login').append('failed');
            }
            else {
            	if(data.length > 0) {
					$('#login').hide();
					$('#bookadmin').show();
            	}
            	else {
            		$('#login').append('invalid admin');
            	}
            }
        }
    });
})