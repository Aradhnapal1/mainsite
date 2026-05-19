<?php include 'header.php'; ?>



<main class="main">
    <div class="page-header text-center" style="background-image: url('assets/images/page-header-bg.jpg')">
        <div class="container">
            <h1 class="page-title">Blog  Detail<span>Blogs</span></h1>
        </div><!-- End .container -->
    </div><!-- End .page-header -->
    <nav aria-label="breadcrumb" class="breadcrumb-nav mb-3">
        <div class="container">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item"><a href="#">Blog</a></li>
            </ol>
        </div><!-- End .container -->
    </nav><!-- End .breadcrumb-nav -->

    <div class="page-content">
        <div class="container">
            <div class="row">
                <div class="col-lg-9">
                    <article class="entry single-entry">
                        <figure class="entry-media">
                            <img id="blogImage" src="" alt="blog image">
                        </figure>

                        <div class="entry-body">
                            <div class="entry-meta">

                                <a href="#" id="blogDate"></a>
                            </div>

                            <h2 class="entry-title" id="blogTitle"></h2>

                            <div class="entry-content editor-content">
                                <p id="blogContent"></p>
                            </div>
                        </div>
                    </article>



                    <div class="related-posts">
                        <h3 class="title">Related Posts</h3><!-- End .title -->

                        <div class="owl-carousel owl-simple" id="relatedBlogsContainer" data-toggle="owl" data-owl-options='{
                                        "nav": false, 
                                        "dots": true,
                                        "margin": 20,
                                        "loop": false,
                                        "responsive": {
                                            "0": {
                                                "items":1
                                            },
                                            "480": {
                                                "items":2
                                            },
                                            "768": {
                                                "items":3
                                            }
                                        }
                                    }'>
                            <!-- Related posts will load here dynamically -->
                        </div><!-- End .owl-carousel -->
                    </div><!-- End .related-posts -->


              
                </div><!-- End .col-lg-9 -->

                <aside class="col-lg-3">
                    <div class="sidebar">
                        <div class="widget widget-search">
                            <h3 class="widget-title">Search</h3><!-- End .widget-title -->

                            <form action="#">
                                <label for="ws" class="sr-only">Search in blog</label>
                                <input type="search" class="form-control" name="ws" id="ws" placeholder="Search in blog"
                                    required>
                                <button type="submit" class="btn"><i class="icon-search"></i><span
                                        class="sr-only">Search</span></button>
                            </form>
                        </div><!-- End .widget -->

                      

                        <div class="widget">
                            <h3 class="widget-title">Popular Posts</h3><!-- End .widget-title -->

                            <ul class="posts-list" id="popularPostsContainer">
                                <!-- Popular posts will load here dynamically -->
                            </ul><!-- End .posts-list -->
                        </div><!-- End .widget -->

                       

                    

                    </div><!-- End .sidebar sidebar-shop -->
                </aside><!-- End .col-lg-3 -->
            </div><!-- End .row -->
        </div><!-- End .container -->
    </div><!-- End .page-content -->
</main><!-- End .main -->
<?php include 'footer.php'; ?>